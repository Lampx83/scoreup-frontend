import config from "~/config.js";

function parseSingleQuestion(raw) {
  const parsed = {};
  const options = [];
  for (const key in raw?.properties) {
    if (/^[a-zA-Z]$/.test(key) && raw.properties[key].rich_text?.length > 0) {
      options.push({
        option: key,
        text: raw.properties[key].rich_text[0].plain_text,
      });
    }
  }
  parsed.options = options.sort((a, b) => a.option.localeCompare(b.option));
  parsed.id = raw._id;
  parsed.question = raw?.properties?.question?.rich_text[0]?.plain_text || undefined;
  parsed.correct = raw?.properties?.correct?.rich_text[0]?.plain_text?.toUpperCase() || undefined;
  parsed.totalComments = raw?.totalComments || 0;
  parsed.knowledge_concept = raw?.properties?.tags?.multi_select[0]?.name || undefined;
  if (raw?.properties?.audio?.rich_text[0]?.plain_text) {
    parsed.audio = config.MEDIA_URL + raw?.properties?.audio?.rich_text[0]?.plain_text;
  }
  if (raw?.properties?.img?.rich_text[0]?.plain_text) {
    parsed.image = config.MEDIA_URL + raw?.properties?.img?.rich_text[0]?.plain_text;
  }
  if (raw?.properties?.code?.rich_text[0]?.plain_text) {
    parsed.code = raw?.properties?.code?.rich_text[0]?.plain_text;
  }
  if (raw?.properties?.hint?.rich_text[0]?.plain_text) {
    parsed.hint = raw?.properties?.hint?.rich_text[0]?.plain_text;
  }
  return parsed;
}

export function parseQuestion(raw) {
  if (!Array.isArray(raw)) return parseSingleQuestion(raw);

  // const context = raw[0]?.properties?.context?.rich_text[0]?.plain_text?.replaceAll("src='", "src='" + config.MEDIA_URL) || undefined;
  let context = raw.filter(question => question.properties.context.rich_text.length > 0)[0]?.properties?.context?.rich_text[0]?.plain_text?.replaceAll("src='", "src='" + config.MEDIA_URL) || "";
  
  const isSameAudio = raw.every(question => question?.properties?.audio?.rich_text[0]?.plain_text && (question?.properties?.audio?.rich_text[0]?.plain_text === raw[0]?.properties?.audio?.rich_text[0]?.plain_text));
  const isSameImage = raw.every(question => question?.properties?.img?.rich_text[0]?.plain_text && (question?.properties?.img?.rich_text[0]?.plain_text === raw[0]?.properties?.img?.rich_text[0]?.plain_text));
  const isSameCode = raw.every(question => question?.properties?.code?.rich_text[0]?.plain_text && (question?.properties?.code?.rich_text[0]?.plain_text === raw[0]?.properties?.code?.rich_text[0]?.plain_text));
  if (isSameAudio) {
    context += `<audio controls controlsList="nodownload" autostart="0" autostart="false" name="media" src=${config.MEDIA_URL + raw[0]?.properties?.audio?.rich_text[0]?.plain_text}>
      Your browser does not support the audio element.
    </audio>`;
    raw.forEach(question => delete question.properties.audio);
  }
  if (isSameImage) {
    context += `<img style="width: 100%; border-radius: 10px" src=${config.MEDIA_URL + raw[0]?.properties?.img?.rich_text[0]?.plain_text} alt=${raw[0]?.properties?.img?.rich_text[0]?.plain_text}/>`;
    raw.forEach(question => delete question.properties.img);
  }
  if (isSameCode) {
    context += `<pre><code>${raw[0]?.properties?.code?.rich_text[0]?.plain_text}</code></pre>`;
    raw.forEach(question => delete question.properties.code);
  }

  return raw.map(parseSingleQuestion).map(question => ({...question, context}));
}

export function parseCertificate(raw) {
  const active = raw?.properties?.active?.checkbox;
  if (!active) return null;

  return {
    id: raw.id,
    title: raw?.properties?.title?.title[0]?.plain_text,
    databaseId: raw?.properties?.database_id?.rich_text[0]?.plain_text,
    sectionInfo: JSON.parse(raw?.properties?.sections_info_json?.rich_text[0]?.plain_text),
    priority: raw?.properties?.piority?.number,
  }
}