# blue-indium
A collaborative virtual puzzle room


## Development

If it's your first time running blue indium all together, run `yarn` and `yarn build` at the root level first, then each time there after:

1. CD into the puzzle of your choice, or the main frontend package and run `yarn dev`
2. Navigate to: http://127.0.0.1:3001

TODO:
- When generating the scss-modules, we need our build CI script to test if the modules are correct or not. So we need it to run first, generate all the typings files, then run the build step once all the typings have been generated.
 