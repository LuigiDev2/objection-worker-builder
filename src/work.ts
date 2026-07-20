import { ObjectionEngine } from "./engines/high-level-objection.engine";
import * as FFmpeg from "@unaxiom/ffmpeg";
import { EngineJob } from "./types/job";

export async function work(fullJob: EngineJob) {
  const worker = new ObjectionEngine();
  worker.buildJob(fullJob);
  const file = await worker.doRender(fullJob);
  let finalFile = file;
  return new Promise<string>((resolve, reject) => {
    if (fullJob.forceCodec) {
      try {
        const ffmpeg = new FFmpeg.FFmpeg();
        finalFile = file.replace(
          /\.[^.]+$/,
          `.${fullJob.forceCodec.extension}`,
        );
        ffmpeg.addOptions(["-y", "-i", file, "-c:v", fullJob.forceCodec.codec]);
        if (fullJob.forceCodec.volume) {
          ffmpeg.addOptions([
            "-filter:a",
            `volume=${fullJob.forceCodec.volume}`,
          ]);
        }
        ffmpeg.setOutputFile(finalFile);
        ffmpeg.run(false);
        ffmpeg.setOnCloseCallback((code: number, signal: string) => {
          if (code === 0) {
            resolve(finalFile);
          } else {
            console.error(signal);
            reject(signal);
          }
        });
      } catch (e) {
        console.error(e);
        reject(e);
      }
    } else {
      resolve(finalFile);
    }
  });
}
// handler.registerCallback(work);
// handler.start().then(() => {});
