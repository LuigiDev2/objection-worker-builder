# objection-worker-builder
 Builds jobs as Court cases using https://github.com/Meorge/objection-godot

 ## Requirements
 ### Hard requirements
 - Node.JS, whatever version it's specified on .nvmrc
 ### Soft requirements
 - GNU/Linux OS. Needed to run the repo "as-is". If you want to use another OS you may need to compile [Objection Godot](https://github.com/Meorge/objection-godot
) yourself

## How-To
- The usual node+TS dance. `npm install` `npx tsc`
- If you want to try an example compile the test `npx tsc tests/simple.ts` and run it `node tests/simple.js`

To use it on a library check how it's being done at https://github.com/LuigiDev2/bluesky-court-bot . I'm basically using git submodules because they let me get away without pre-compiling this and also I don't feel like publishing a packet to npm just yet
