import { spawn } from "node:child_process";
import { characters } from "../characters";
import { randomElementAndIdxFromArr, randomElementFromArr } from "../utils";
import { OGXMLEngine } from "./objection-godot-xml-engine";
import fs from "node:fs/promises";
import { EngineJob } from "../types/job";
import { Character } from "../types/character-type";

export class ObjectionEngine extends OGXMLEngine {
  objectionStarted = false;
  selectedGame: "pwr" | "jfa" | "tat";

  constructor() {
    super();
    if (Math.random() < 0.80) {
      this.selectedGame = "pwr";
    } else if (Math.random() < 0.5) {
      this.selectedGame = "jfa";
    } else {
      this.selectedGame = "tat";
    }
    const baseTrack = Math.random() < 0.5 ? "cross-moderato" : "trial";
    this.startMusic(`res://audio/music/${this.selectedGame}/${baseTrack}.wav`);
  }

  buildJob(job: EngineJob) {
    const users = new Map<
      string,
      { displayName: string; character: Character }
    >();
    let phoenixPicked = false;
    let edgeworthPicked = false;
    let availableForPickup = characters.filter(
      (characters) => !["phoenix", "edgeworth"].includes(characters.name),
    );

    for (const comment of job.comments) {
      // Setting the user info
      const userId =
        comment.user.id ??
        comment.user.displayName ??
        comment.user?.preferedCharacter ??
        Math.random().toString();

      if (!users.has(userId)) {
        const desiredCharacter = comment.user.preferedCharacter
          ? characters.find(
              (character) => character.name === comment.user.preferedCharacter,
            )
          : null;
        let finalCharacter: Character;
        if (desiredCharacter) {
          finalCharacter = desiredCharacter;
        } else {
          if (!phoenixPicked) {
            finalCharacter = characters.find(
              (character) => character.name === "phoenix",
            )!;
            phoenixPicked = true;
          } else if (!edgeworthPicked) {
            finalCharacter = characters.find(
              (character) => character.name === "edgeworth",
            )!;
            edgeworthPicked = true;
          } else {
            const { element, idx } =
              randomElementAndIdxFromArr(availableForPickup);
            finalCharacter = element;
            availableForPickup.splice(idx, 1);
            if (availableForPickup.length === 0) {
              availableForPickup = characters.slice();
            }
          }
        }
        users.set(userId, {
          displayName: comment.user.displayName ?? finalCharacter.name,
          character: finalCharacter,
        });
      }
      if (Math.random() < 0.25) {
        if (!this.objectionStarted) {
          this.stopmusic();
        }
        this.objection(userId);
        if (!this.objectionStarted) {
          const objectionTrack = Math.random() < 0.5 ? "press" : "objection";
          this.startMusic(
            `res://audio/music/${this.selectedGame}/${objectionTrack}.wav`,
          );
          this.objectionStarted = true;
        }
      }
      this.dialog(comment.text ?? "", {
        evidence: comment.evidence,
        id: userId,
      });
    }

    for (const [id, char] of users.entries()) {
      this.addMember(id, char.displayName, char.character.name);
    }
  }

  async doRender(job: EngineJob) {
    const xml = this.finish();
    await fs.mkdir(job.tmpDir, { recursive: true });
    const scriptLocation = job.tmpDir.concat("/script.xml");
    await fs.writeFile(scriptLocation, xml, {
      encoding: "utf-8",
    });
    return new Promise<string>((resolve, reject) => {
      const movieDir = job.tmpDir.concat("/movie.avi");
      spawn(
        "xvfb-run",
        [
          "-an",
          "90",
          "-s",
          "-screen 0 256x192x24",
          __dirname + "/godot-objection/objection-godot-stable.x86_64",
          "--write-movie",
          movieDir,
          "--fixed-fps",
          "30",
          "--",
          "--payne",
          `--render-script="${scriptLocation}"`,
        ],
        { stdio: "inherit" },
      ).on("exit", (code) => {
        if (code === 0) {
          resolve(movieDir);
        } else {
          reject();
        }
      });
    });
  }

  // private showObjection(character: Character) {
  //   this.stopMusic()
  //     .bubble("objection")
  //     .removeBox()
  //     .removeArrow()
  //     .removeSegmentTitle()
  //     .playSound(
  //       character.objection ??
  //         "res://ui/exclamations/exclamation_sounds/objection-generic.wav",
  //     )
  //     .addWait(1)
  //     .addPlayTag()
  //     .startMusic("res://audio/music/pwr/press.mp3");
  // }
}
