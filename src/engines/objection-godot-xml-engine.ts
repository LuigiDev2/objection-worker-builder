import { create } from "xmlbuilder2";

/** Interfaces directly with the XML source code. Only primitive functions will be here*/
export class OGXMLEngine {
  private xmlDocument = create({ standalone: true }).ele("payne");
  private cast = this.xmlDocument.ele("cast");
  private conversation = this.xmlDocument.ele("conversation");

  protected addMember(id: string, name: string, character: string) {
    this.cast.ele("character", {
      id: id,
      display_name: name,
      character: character,
    });
    return this;
  }

  // Example XML uses a <startmusic res="..."/> tag. Add a corresponding helper.
  protected startMusic(uri: string) {
    const el = this.conversation.ele("startmusic");
    el.att("res", uri);
    return this;
  }

  // <dialog id="a" anim="coffee">Text...</dialog>
  protected dialog(
    text: string,
    options: { id?: string; anim?: string; evidence?: string } = {},
  ) {
    const el = this.conversation.ele("dialog");
    if (options.id) el.att("id", options.id);
    if (options.anim) el.att("anim", options.anim);
    if (options.evidence) el.att("evidence", options.evidence);
    if (text) el.txt(text);
    return this;
  }

  protected newevidence(title: string, description: string, res: string) {
    const el = this.conversation.ele("newevidence");
    el.att("title", title);
    el.att("description", description);
    el.att("res", res);
    return this;
  }

  protected objection(charId: string) {
    const el = this.conversation.ele("objection");
    el.att("id", charId);
    return this;
  }

  protected gavelSlams(slams: number) {
    const el = this.conversation.ele("gavel");
    el.att("slams", slams.toString());
    return this;
  }


  protected stopmusic() {
    this.conversation.ele("stopmusic");
    return this;
  }

  public finish() {
    const originalFormatted = this.xmlDocument.end({
      headless: true,
      prettyPrint: false,
    });
    const definitiveDocument = originalFormatted;
    return definitiveDocument;
  }
}
