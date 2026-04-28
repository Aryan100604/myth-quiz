import type { Category, Question, Lesson } from '@/types'

export const QUESTIONS: Record<Category, Question[]> = {
  greek: [
    { id: 1, text: 'Who is the god of the sea?', options: ['Poseidon', 'Zeus', 'Ares', 'Hermes'], correctIndex: 0 },
    { id: 2, text: 'Which goddess represents wisdom?', options: ['Aphrodite', 'Hera', 'Athena', 'Artemis'], correctIndex: 2 },
    { id: 3, text: 'Who carried the sky on his shoulders?', options: ['Hercules', 'Atlas', 'Prometheus', 'Titan'], correctIndex: 1 },
    { id: 4, text: 'What is the Greek underworld called?', options: ['Elysium', 'Olympus', 'Hades', 'Tartarus'], correctIndex: 2 },
    { id: 5, text: 'Who stole fire from the gods?', options: ['Zeus', 'Hermes', 'Hephaestus', 'Prometheus'], correctIndex: 3 },
  ],
  hindu: [
    { id: 1, text: 'Who is the preserver in the Hindu Trinity?', options: ['Brahma', 'Vishnu', 'Shiva', 'Indra'], correctIndex: 1 },
    { id: 2, text: 'What is the mount of Lord Ganesha?', options: ['Lion', 'Bull', 'Mouse', 'Eagle'], correctIndex: 2 },
    { id: 3, text: 'Who is the goddess of wealth?', options: ['Saraswati', 'Durga', 'Lakshmi', 'Parvati'], correctIndex: 2 },
    { id: 4, text: 'Which river is considered most sacred?', options: ['Yamuna', 'Ganga', 'Saraswati', 'Brahmaputra'], correctIndex: 1 },
    { id: 5, text: 'What is the weapon of Indra?', options: ['Trishul', 'Vajra', 'Sudarshana', 'Gandiva'], correctIndex: 1 },
  ],
  norse: [
    { id: 1, text: 'Who is the chief of the Norse gods?', options: ['Thor', 'Loki', 'Odin', 'Freyr'], correctIndex: 2 },
    { id: 2, text: 'What is the name of Thor\'s hammer?', options: ['Gungnir', 'Mjolnir', 'Excalibur', 'Durandal'], correctIndex: 1 },
    { id: 3, text: 'What is the Norse world tree called?', options: ['Bifrost', 'Yggdrasil', 'Asgard', 'Midgard'], correctIndex: 1 },
    { id: 4, text: 'Who is the trickster god?', options: ['Baldr', 'Tyr', 'Loki', 'Heimdall'], correctIndex: 2 },
    { id: 5, text: 'What is the final battle in Norse mythology?', options: ['Ragnarok', 'Valhalla', 'Niflheim', 'Helheim'], correctIndex: 0 },
  ],
  egyptian: [
    { id: 1, text: 'Who is the god of the dead?', options: ['Ra', 'Horus', 'Osiris', 'Set'], correctIndex: 2 },
    { id: 2, text: 'Which goddess has the head of a cat?', options: ['Isis', 'Bastet', 'Hathor', 'Nephthys'], correctIndex: 1 },
    { id: 3, text: 'What is the sun god of ancient Egypt?', options: ['Thoth', 'Anubis', 'Ra', 'Ptah'], correctIndex: 2 },
    { id: 4, text: 'Who has the head of a jackal?', options: ['Horus', 'Set', 'Anubis', 'Sobek'], correctIndex: 2 },
    { id: 5, text: 'What did Egyptians call their writing system?', options: ['Cuneiform', 'Hieroglyphics', 'Linear A', 'Runes'], correctIndex: 1 },
  ],
}

export const LESSONS: Record<Category, Lesson> = {
  greek: {
    category: 'greek',
    title: 'Gods of Olympus',
    icon: '⚡',
    body: `In Greek mythology, twelve powerful gods ruled the universe from the peak of Mount Olympus. Zeus, the king of the Olympians, commanded thunder and lightning. His brothers divided the cosmos: Poseidon received dominion over the seas with his mighty trident, while Hades ruled the underworld — the realm of the dead.

Wisdom and strategic warfare belonged to Athena, who sprang fully formed and armoured from Zeus's head. Apollo governed the sun, music, and prophecy, while his twin Artemis ruled the moon and the hunt.

Perhaps the most enduring myth is Prometheus, a Titan who stole fire from Olympus and gave it to humanity. Zeus chained him to a mountain where an eagle ate his liver each day — only for it to regrow by night.`,
  },
  hindu: {
    category: 'hindu',
    title: 'The Divine Trinity',
    icon: '🪷',
    body: `Hindu mythology revolves around the Trimurti — three supreme beings responsible for the cycle of the universe. Brahma is the Creator, who brought the world into existence. Vishnu is the Preserver, who maintains cosmic order and descends to Earth in various avatars (forms) whenever evil threatens to overwhelm good.

The most celebrated avatars of Vishnu are Rama and Krishna, both of whom are central to the great epics Ramayana and Mahabharata. Shiva is the Destroyer — but destruction in Hindu thought is not evil; it clears the way for new creation.

Lakshmi, goddess of wealth and fortune, is the consort of Vishnu. Saraswati, goddess of knowledge and arts, is Brahma's consort. Together they represent the balance of material and spiritual life.`,
  },
  norse: {
    category: 'norse',
    title: 'Realms of Asgard',
    icon: '🐺',
    body: `Norse mythology describes nine interconnected worlds held together by the great world tree Yggdrasil. At the top sits Asgard, home of the Aesir gods led by the one-eyed Odin, the Allfather, who sacrificed his eye at Mimir's well to gain cosmic wisdom.

Thor, Odin's son and the god of thunder, wields the hammer Mjolnir — a weapon so powerful it can level mountains. The trickster Loki, born of giants but raised among gods, brings both mischief and catastrophe to Asgard.

Norse mythology culminates in Ragnarok — a great battle that destroys and rebirths the world. Most gods fall, including Odin (swallowed by the wolf Fenrir) and Thor (killed by the Midgard Serpent). But from the ashes, a new world rises.`,
  },
  egyptian: {
    category: 'egyptian',
    title: 'Gods of the Nile',
    icon: '🐍',
    body: `Ancient Egyptian mythology is centred on the cycle of the sun, the flooding of the Nile, and the journey of the soul after death. Ra, the sun god, sailed his solar barque across the sky each day and through the underworld each night, battling the chaos serpent Apophis before rising again at dawn.

Osiris, the god of the dead, was murdered by his jealous brother Set and resurrected by his wife Isis — the goddess of magic. Their story became Egypt's most important myth: a promise of resurrection and eternal life. Their son Horus, the falcon-headed sky god, later defeated Set and became ruler of the living.

Anubis, the jackal-headed god, guided souls to the Hall of Two Truths where the heart was weighed against the feather of Ma'at (truth and justice). Only a pure heart allowed passage to paradise.`,
  },
}

export const CATEGORY_META: Record<Category, { label: string; icon: string; color: string; borderColor: string }> = {
  greek: { label: 'Greek', icon: '⚡', color: 'bg-amber-50', borderColor: 'border-amber-200' },
  hindu: { label: 'Hindu', icon: '🪷', color: 'bg-red-50', borderColor: 'border-red-200' },
  norse: { label: 'Norse', icon: '🐺', color: 'bg-blue-50', borderColor: 'border-blue-200' },
  egyptian: { label: 'Egyptian', icon: '🐍', color: 'bg-green-50', borderColor: 'border-green-200' },
}
