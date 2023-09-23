interface ICategory {
  name: string; // using in UI (unique name)
  icon: string; // icon id from iconify library [https://icon-sets.iconify.design/]
  color: string; // color in hex
}

// Default category for all lists
const defaultCategory: ICategory = {
  name: 'Others',
  icon: 'mdi:help-circle-outline',
  color: '#6666ff',
} as const;

// Youtube category
const youtubeCategory: ICategory = {
  name: 'Youtube',
  icon: 'simple-icons:youtube',
  color: '#ff0000',
} as const;

// spotify category
const spotifyCategory: ICategory = {
  name: 'Spotify',
  icon: 'simple-icons:spotify',
  color: '#1DB954',
} as const;

// deposit category (only for transactions)
const depositCategory: ICategory = {
  name: 'Deposit',
  icon: 'mdi:cash-fast',
  color: '#6666ff',
} as const;

export const subsCategory = [defaultCategory, youtubeCategory, spotifyCategory] as const;

export const transactionCategory = [
  defaultCategory,
  youtubeCategory,
  spotifyCategory,
  depositCategory,
] as const;
