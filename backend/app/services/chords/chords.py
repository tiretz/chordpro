# https://github.com/mreintz/circleOfFifths

from musthe import Interval, Note

__translateNote = {"B#": "C", "E#": "F", "Fb": "E", "Cb": "B", "Ebb": "D", "Bbb": "A"}

__fifth = Interval("P5")
__fourth = Interval("P4")


def get_chords(key: str) -> list[tuple[str, str, str, str]]:

    mode: int = 0 if not "m" in key else 3

    key = key.replace("m", "")

    note: Note = Note(key)

    if note == Note("Gb"):
        note = Note("F#")

    circle: list[Note] = []
    sharpcircle: list[Note] = []

    for i in range(12):
        sharpcircle.append(note)
        note = (note + __fifth).to_octave(4)
        i = i + 1

    circle = sharpcircle[:7]

    flatcircle: list[Note] = []

    note = Note(key)

    for i in range(11):
        note = (note + __fourth).to_octave(4)
        flatcircle.append(note)
        i = i + 1

    reverse_circle: list[Note] = flatcircle[:5]
    reverse_circle.reverse()

    circle = circle + reverse_circle

    circle_as_string: list[str] = []

    for note in circle:
        notestring = str(note.letter) + str(note.accidental)
        circle_as_string.append(__translateNote.get(notestring, notestring))

    chord_template: dict[int, list[str]] = {
        -1: ["I", "V", "II", "vi", "iii", "vii", "iv°", "", "", "", "", ""],
        0: ["I", "V", "ii", "vi", "iii", "vii°", "", "", "", "", "", "IV"],
        1: ["I", "v", "ii", "vi", "iii°", "", "", "", "", "", "VII", "IV"],
        2: ["i", "v", "ii", "vi°", "", "", "", "", "", "III", "VII", "IV"],
        3: ["i", "v", "ii°", "", "", "", "", "", "VI", "III", "VII", "iv"],
        4: ["i", "v°", "", "", "", "", "", "II", "VI", "III", "vii", "iv"],
        5: ["i°", "", "", "", "", "", "V", "II", "VI", "iii", "vii", "iv"],
    }

    chord_type: dict[int, list[str]] = {
        -1: ["M", "M", "M", "m", "m", "m", "d", "", "", "", "", ""],
        0: ["M", "M", "m", "m", "m", "d", "", "", "", "", "", "M"],
        1: ["M", "m", "m", "m", "d", "", "", "", "", "", "M", "M"],
        2: ["m", "m", "m", "d", "", "", "", "", "", "M", "M", "M"],
        3: ["m", "m", "d", "", "", "", "", "", "M", "M", "M", "m"],
        4: ["m", "d", "", "", "", "", "", "M", "M", "M", "m", "m"],
        5: ["d", "", "", "", "", "", "M", "M", "M", "m", "m", "m"],
    }

    chord_numbering: dict[int, list[int]] = {
        -1: [1, 5, 2, 6, 3, 7, 4, 0, 0, 0, 0, 0],
        0: [1, 5, 2, 6, 3, 7, 0, 0, 0, 0, 0, 4],
        1: [1, 5, 2, 6, 3, 0, 0, 0, 0, 0, 7, 4],
        2: [1, 5, 2, 6, 0, 0, 0, 0, 0, 3, 7, 4],
        3: [1, 5, 2, 0, 0, 0, 0, 0, 6, 3, 7, 4],
        4: [1, 5, 0, 0, 0, 0, 0, 2, 6, 3, 7, 4],
        5: [1, 0, 0, 0, 0, 0, 5, 2, 6, 3, 7, 4],
    }

    numbering: list[int] = chord_numbering[mode]
    template: list[str] = chord_template[mode]
    cformat: list[str] = chord_type[mode]

    chords = []

    for i in range(7):

        i = i + 1

        idx: int = numbering.index(i)

        type: str = template[idx]

        chord: str = circle_as_string[idx]

        chord_format: str = cformat[idx]

        if chord_format == "M":
            formatted_chord = chord
        elif chord_format == "m":
            formatted_chord = chord + "m"
        elif chord_format == "d":
            formatted_chord = chord + "°"

        chords.append((type, chord, chord_format, formatted_chord))

    return chords
