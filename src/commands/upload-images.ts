import Command from '@oclif/command';
import * as signale from 'signale';
import * as fs from 'fs';
import { NFTStorage, File } from 'nft.storage';

const endpoint = new URL('https://api.nft.storage'); // the default
const token: string = process.env.NFT_STORAGE_API_KEY || ''; // your API key from https://nft.storage/manage

export class UploadImagesCommand extends Command {
  async run() {
    const storage = new NFTStorage({ endpoint, token });

    const imageFiles: Buffer[] = [];
    for (let i = 1; i < 8; i++) {
      imageFiles.push(
        await fs.promises.readFile(`${process.cwd()}/workspace/images/${i}.jpg`)
      );
    }

    const imagesCID = await storage.storeDirectory(
      imageFiles.map((image, index) => new File(<any>image, `${index + 1}.jpg`))
    );
    signale.info('Images cid: ', { imagesCID });
    const imagesStatus = await storage.status(imagesCID);
    signale.info(imagesStatus);

    const metadata: string[] = [];
    for (let i = 1; i < 8; i++) {
      metadata.push(
        JSON.stringify({
          image: `ipfs://${imagesCID}/${i}.jpg`,
          name: `Cryptopi #${i}`,
          attributes: [],
        })
      );
    }

    const metadataCID = await storage.storeDirectory(
      metadata.map(
        (metadata, index) => new File(<any>metadata, `${index + 1}.json`)
      )
    );

    signale.info('Metadata cid: ', { metadataCID });
    const metadataStatus = await storage.status(metadataCID);
    signale.info(metadataStatus);
  }
}
