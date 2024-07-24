import config from "~/config.js";

function parseSingleQuestion(raw) {
  const parsed = {};
  const options = [];
  for (const key in raw?.properties) {
    if (/^[a-zA-Z]$/.test(key) && raw.properties[key].rich_text?.length > 0) {
      options.push(`${raw.properties[key].rich_text[0].plain_text}`);
    }
  }
  parsed.options = options;
  parsed.question = raw?.properties?.question?.rich_text[0]?.plain_text || undefined;
  if (raw?.properties?.audio?.rich_text[0]?.plain_text) {
    parsed.audio = config.MEDIA_URL + raw?.properties?.audio?.rich_text[0]?.plain_text;
  }
  if (raw?.properties?.img?.rich_text[0]?.plain_text) {
    parsed.image = config.MEDIA_URL + raw?.properties?.img?.rich_text[0]?.plain_text;
  }
  if (raw?.properties?.code?.rich_text[0]?.plain_text) {
    parsed.code = raw?.properties?.code?.rich_text[0]?.plain_text;
  }
  return parsed;
}

export function parseQuestion(raw) {
  if (!Array.isArray(raw)) return parseSingleQuestion(raw);

  const context = raw[0]?.properties?.context?.rich_text[0]?.plain_text?.replaceAll("src='", "src='" + config.MEDIA_URL) || undefined;

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