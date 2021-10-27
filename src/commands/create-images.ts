import { Command, flags } from '@oclif/command';
import * as fs from 'fs';
import * as images from 'images';
import signale = require('signale');
import cli from 'cli-ux';
import * as sharp from 'sharp';

export class CreateImagesCommand extends Command {
  static args = [
    {
      name: 'assetsPath',
      required: true,
      description: 'The path to the Trait asset files.',
    },
    {
      name: 'traits',
      required: true,
      description: 'The path to the Traits files.',
    },
    {
      name: 'output',
      required: true,
      description: 'The path to output the images to.',
    },
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    index: flags.string({
      char: 'i',
      description: 'The specific index to create an image for.',
    }),
  };

  count: number = 0;

  createImage(traits, i, args, progressBar) {
    const traitArray = traits[i];

    //signale.debug('Traits: ', traitArray);

    const imageFiles = [];
    traitArray
      .filter((trait) => trait)
      .forEach((trait) => {
        const traitFileName = `${args.assetsPath}/${trait
          .replace(/\s/g, '_')
          .replace(/\'/g, '_')}.png`;

        if (fs.existsSync(traitFileName)) {
          imageFiles.push(traitFileName);
        } else {
          signale.error('Trait does not exist: ', traitFileName);
        }
      });

    // signale.debug('imageFiles: ', imageFiles);
    // signale.debug('main: ', imageFiles[0]);
    // signale.debug(
    //   'composite: ',
    //   imageFiles.slice(1, imageFiles.length).map((imageFile) => ({
    //     input: imageFile,
    //   }))
    // );

    sharp(imageFiles[0])
      .composite(
        imageFiles.slice(1, imageFiles.length).map((imageFile) => ({
          input: imageFile,
        }))
      )
      .jpeg({
        quality: 99,
      })
      .toFile(`${args.output}/${i + 1}.jpg`, (err) => {
        if (err) {
          signale.error(err);
        } else {
          this.count++;
          progressBar.update(this.count);
        }
      });
  }

  async run() {
    const { args, flags } = this.parse(CreateImagesCommand);

    const traits = JSON.parse(fs.readFileSync(args.traits).toString());

    const progressBar = cli.progress({
      format: '  Creating Images [ {bar} ] {percentage}% | {value}/{total}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
    });

    if (flags.index) {
      progressBar.start(1, 0);
      this.createImage(traits, Number(flags.index) - 1, args, progressBar);
    } else {
      progressBar.start(traits.length, 0);

      for (let i = 0; i < traits.length - 1; i++) {
        this.createImage(traits, i, args, progressBar);
      }
    }
  }
}
