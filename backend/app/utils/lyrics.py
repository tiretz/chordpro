from re import match, Match, search


def adapt_lyrics_to_chordpro(lyrics: str) -> str:

    lyric_lines: list[str] = lyrics.split("\n")
    adapted_lyrics: list[str] = []

    close_tag: str | None = None

    for line in lyric_lines:

        line = line.replace("’", "'")

        if not line:
            if close_tag:
                adapted_lyrics.append(close_tag)
                close_tag = None

            if adapted_lyrics and adapted_lyrics[-1]:
                adapted_lyrics.append(line)

            continue

        section_match: Match[str] | None = match(r"\[(.*?)\]", line)

        if not section_match:
            adapted_lyrics.append(line)
            continue

        match_to_lower: str = section_match.group(1).lower()

        if "intro" in match_to_lower:
            adapted_lyrics.append("{sop: Intro}")
            close_tag = f"{{eop}}"

        elif [entry for entry in ["verse", "strophe"] if (entry in match_to_lower)]:
            verse_number: Match[str] | None = search(r"\d+", match_to_lower)

            adapted_lyrics.append(f"{{sov: Verse {verse_number.group(0) if verse_number else ""}}}")
            close_tag = f"{{eov}}"

        elif [entry for entry in ["chorus", "refrain", "hook"] if (entry in match_to_lower)]:
            adapted_lyrics.append(f"{{soc: Chorus}}")
            close_tag = f"{{eoc}}"

        elif [entry for entry in ["bridge", "breakdown"] if (entry in match_to_lower)]:
            adapted_lyrics.append(f"{{sob: Bridge}}")
            close_tag = f"{{eob}}"

        elif "pre-chorus" in match_to_lower:
            adapted_lyrics.append(f"{{sop: Pre-Chorus}}")
            close_tag = f"{{eop}}"

        elif "post-chorus" in match_to_lower:
            adapted_lyrics.append(f"{{sop: Post-Chorus}}")
            close_tag = f"{{eop}}"

        elif [entry for entry in ["interlude", "segue", "skit"] if (entry in match_to_lower)]:
            adapted_lyrics.append(f"{{sop: Interlude}}")
            close_tag = f"{{eop}}"

        elif [entry for entry in ["solo", "instrumental"] if (entry in match_to_lower)]:
            adapted_lyrics.append(f"{{sop: Instrumental}}")
            close_tag = f"{{eop}}"

        elif "outro" in match_to_lower:
            adapted_lyrics.append(f"{{sop: Outro}}")
            close_tag = f"{{eop}}"

    if close_tag:
        adapted_lyrics.append(close_tag)

    return "\n".join(adapted_lyrics)
