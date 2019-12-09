# GSuite Gulp Build

1. Put json files in src folder structure as follows: `src/gs_<language>/<concept-name>/<width>x<height>.json`
2. run `gulp build` to insert json into html template, move to `tmp` folder
3. run `gulp dist` to compress everything in `tmp` folder and move to `dist`
4. run `gulp index` to create an index file that includes everything in the `dist folder`
