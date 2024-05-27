export const genRanHex = (size: Number) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

export const file_extension = (fn: String) =>
  fn.slice(((fn.lastIndexOf(".") - 1) >>> 0) + 2);

export const husbandoTags = [
  "man",
  "boy",
  "shota",
  "muscle",
  "trap",
  "sleeping",
  "fat",
  "wolf",
  "neko",
  "bunny",
  "furry",
  "kiss",
  "gif",
  "dark_skin",
  "high_school",
  "hug",
  "love",
  "prostitute",
  "anal",
  "ass",
  "non_human",
  "boobs",
  "bdsm",
  "blowjob",
  "gangbang",
  "creampie",
  "cumshot",
  "big_breasts",
  "large_penis",
  "peeled_foreskin",
  "threesome",
  "foursome",
  "masturbate",
  "paizuri",
  "naked",
  "handjob",
  "3D",
  "oral",
  "feet",
  "fingering",
  "cumming",
  "other",
];
