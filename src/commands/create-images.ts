import Command from '@oclif/command';
import * as fs from 'fs';
import * as images from 'images';
import signale = require('signale');

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

  async run() {
    const { args } = this.parse(CreateImagesCommand);

    const traits = JSON.parse(fs.readFileSync(args.traits).toString());

    for (let i = 0; i < traits.length - 1; i++) {
      const traitArray = traits[i];

      let image: images.Image = null;
      traitArray
        .filter((trait) => trait)
        .forEach((trait) => {
          const traitFileName = `${args.assetsPath}/${trait
            .replace(/\s/g, '_')
            .replace(/\'/g, '_')}.png`;

          if (fs.existsSync(traitFileName)) {
            if (!image) {
              image = images(traitFileName);
            }
            image.draw(images(traitFileName), 0, 0);
          } else {
            signale.error('Trait does not exist: ', traitFileName);
          }
        });

      image.save(`${args.output}/${i + 1}.jpg`, { quality: 100 });
    }
  }
}
