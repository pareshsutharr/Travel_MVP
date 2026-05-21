import type { Journey } from '@/types/database'

export const travelImages = {
  varanasi:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Varanasi%20ghats%20at%20the%20sunrise.JPG?width=1400',
  rishikesh:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Ganges%20above%20Rishikesh.jpg?width=1400',
  nepal:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Phewa%20lake%2C%20Pokhara.jpg?width=1400',
  annapurna:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Annapurna%20Sanctuary%20Panorama%20May%202013.jpg?width=1400',
  bodhGaya:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Mahabodhitemple.jpg?width=1400',
  lumbini:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Maya%20Devi%20Temple%20and%20Ashoka%20Pillar%2C%20Lumbini%2C%20Rupandehi%2C%20Nepal.jpg?width=1400',
  wellness:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Ganges%20above%20Rishikesh.jpg?width=1400',
  heritage:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Mahabodhitemple.jpg?width=1400',
  spiritual:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Varanasi%20ghats%20at%20the%20sunrise.JPG?width=1400',
  adventure:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Annapurna%20Sanctuary%20Panorama%20May%202013.jpg?width=1400',
}

export function getJourneyImage(journey?: Pick<Journey, 'title' | 'category' | 'route'> | null) {
  const text = `${journey?.title ?? ''} ${journey?.route ?? ''} ${journey?.category ?? ''}`.toLowerCase()

  if (text.includes('annapurna') || text.includes('abc')) return travelImages.annapurna
  if (text.includes('pokhara') || text.includes('nepal')) return travelImages.nepal
  if (text.includes('lumbini')) return travelImages.lumbini
  if (text.includes('buddha') || text.includes('bodh')) return travelImages.bodhGaya
  if (text.includes('heritage')) return travelImages.bodhGaya
  if (text.includes('rishikesh') || text.includes('wellness') || text.includes('yoga')) return travelImages.wellness
  if (text.includes('adventure')) return travelImages.adventure
  if (text.includes('varanasi') || text.includes('ganges') || text.includes('kashi')) return travelImages.varanasi

  return travelImages.spiritual
}

export function getPlaceImage(placeName?: string | null, placeLocation?: string | null) {
  const text = `${placeName ?? ''} ${placeLocation ?? ''}`.toLowerCase()

  if (text.includes('annapurna') || text.includes('abc')) return travelImages.annapurna
  if (text.includes('pokhara') || text.includes('phewa')) return travelImages.nepal
  if (text.includes('lumbini')) return travelImages.lumbini
  if (text.includes('bodh') || text.includes('buddha')) return travelImages.bodhGaya
  if (text.includes('rishikesh') || text.includes('ganga')) return travelImages.rishikesh
  if (text.includes('varanasi') || text.includes('kashi') || text.includes('ganges')) return travelImages.varanasi

  return travelImages.spiritual
}

export function imageScrim(strength = 0.35) {
  return `linear-gradient(180deg, rgba(28,25,23,${strength * 0.35}) 0%, rgba(28,25,23,${strength}) 100%)`
}
