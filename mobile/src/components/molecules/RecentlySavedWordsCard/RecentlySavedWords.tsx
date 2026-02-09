import { View } from "react-native";
import SimpleWordCard from "../../atoms/SimpleWordCard/SimpleWordCard";

const MOCK_WORD_DATA = [
  {
    word: "ephermal",
    def: "lasting for a short time",
  },
  {
    word: "sonder",
    def: "the realization that everyone and this is a long one",
  },
  {
    word: "perichor",
    def: "the smell of rain on dry earth",
  },
];

export default function RecentlySavedWordsCard() {
  return (
    <View>
      {MOCK_WORD_DATA.map((word) => (
        <SimpleWordCard word={word.word} definition={word.def} />
      ))}
    </View>
  );
}
