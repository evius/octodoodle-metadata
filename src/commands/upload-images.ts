import { Command, flags } from '@oclif/command';
import * as signale from 'signale';
import * as fs from 'fs';
import { NFTStorage, File } from 'nft.storage';
import { TRAIT_TYPE } from '../model/constants';
const child_process = require('child_process');

const quotes = require('../quotes.json');

const endpoint = new URL('https://api.nft.storage/upload'); // the default
const token: string = process.env.NFT_STORAGE_API_KEY || ''; // your API key from https://nft.storage/manage

const storage = new NFTStorage({ endpoint, token });

export class UploadImagesCommand extends Command {
  static args = [
    {
      name: 'traits',
      required: true,
      description: 'The path to the Traits files.',
    },
    {
      name: 'imagesPath',
      required: true,
      description: 'The path to the generated images.',
    },
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    dryRun: flags.string({
      char: 'd',
      description: 'Performs a dry run.',
    }),
    imageCIDs: flags.string({
      description: 'Path to images cids',
    }),
  };

  uploadImage(index: number, imagePath: string, dryRun: any): string {
    const cmd = `curl -X POST --data-binary @${imagePath} -H 'Authorization: Bearer ${token}' ${endpoint}`;

    //signale.info(cmd);

    if (!dryRun) {
      const resp = child_process.execSync(cmd);
      const result = JSON.parse(resp.toString('UTF8'));

      if (!result.ok) {
        throw Error(`Failed to upload image: ${result}`);
      }

      signale.info('Image uploaded: ', result.value.cid);

      return result.value.cid;
    }

    return (index + 1).toString();
  }

  async uploadImages(traits: Array<any>, imagesPath: string, dryRun: any) {
    const batchSize = 5; // Size of batch to upload at a time
    let current = 0;
    let currentInBatch = 0;
    let batchStart = 0;

    let imageFiles: File[] = [];

    let imageCIDs = [];

    for (let i = 0; i < traits.length; i++) {
      const imagePath = `${imagesPath}/${i + 1}.jpg`;

      signale.info('Uploading image: ', imagePath);

      imageCIDs.push(this.uploadImage(i, imagePath, dryRun));
    }

    return imageCIDs;
  }

  uploadMetadata(traits, metadataPath, dryRun) {
    let cmd =
      `curl -X POST ${endpoint} ` +
      `-H 'Authorization: Bearer ${token}' ` +
      "-H 'Content-Type: multipart/form-data' " +
      "-H 'accept: application/json' ";

    for (let i = 0; i < traits.length; i++) {
      cmd += `-F 'file=@${metadataPath}/${i + 1}.json;type=application/json' `;
    }

    signale.debug(cmd);

    if (!dryRun) {
      const resp = child_process.execSync(cmd);
      const result = JSON.parse(resp.toString('UTF8'));

      if (!result.ok) {
        throw Error(`Failed to upload metadata: ${JSON.stringify(result)}`);
      }

      signale.info('Metadata uploaded: ', result.value.cid);

      return result.value.cid;
    }

    return 'abc';
  }

  async run() {
    const { args, flags } = this.parse(UploadImagesCommand);

    const traits = JSON.parse(fs.readFileSync(args.traits).toString());

    signale.info('Uploading images...');

    let imagesCIDs: string[] = [];
    if (flags.imageCIDs) {
      imagesCIDs = JSON.parse(fs.readFileSync(flags.imageCIDs).toString());
    } else {
      imagesCIDs = await this.uploadImages(
        traits,
        args.imagesPath,
        flags.dryRun
      );
    }

    fs.writeFileSync(
      `${args.imagesPath}/../imageCIDs.json`,
      JSON.stringify(imagesCIDs)
    );

    const trait_types = Object.values(TRAIT_TYPE).map(
      (type) => type as TRAIT_TYPE
    );

    signale.info('Uploading metadata...');

    const metadata: any[] = [];
    traits.forEach((traitArray, i) => {
      const metadataPath = `${args.imagesPath}/../metadata/${i + 1}.json`;
      const meta = {
        image: `ipfs://${imagesCIDs[i]}`,
        name: `Octodoodle #${i + 1}`,
        description: `${quotes[i].quoteText} - ${quotes[i].quoteAuthor}`,
        attributes: Object.values(TRAIT_TYPE)
          .map((type) => type as TRAIT_TYPE)
          .map((trait_type) => ({
            trait_type,
            value: traitArray[trait_types.indexOf(trait_type)],
          })),
      };

      fs.writeFileSync(metadataPath, JSON.stringify(meta));
      metadata.push(meta);
    });

    fs.writeFileSync(
      `${args.imagesPath}/../metadata.json`,
      JSON.stringify(metadata)
    );

    const metadataCID = this.uploadMetadata(
      traits,
      `${args.imagesPath}/../metadata`,
      flags.dryRun
    );

    fs.writeFileSync(`${args.imagesPath}/../metadataCID.txt`, metadataCID);

    signale.info('Metadata cid: ', { metadataCID });
    if (!flags.dryRun) {
      const metadataStatus = await storage.status(metadataCID);
      signale.info(metadataStatus);
    }
  }
}
