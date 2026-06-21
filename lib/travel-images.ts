import type { Journey } from '@/types/database'

export const travelImages = {
  travelerWallpaper: '/wp3067500-traveler-wallpapers.jpg',
  travelUltraHd: '/wp5240504-travel-ultra-hd-wallpapers.jpg',
  travelUltraHdAlt: '/wp5240579-travel-ultra-hd-wallpapers.jpg',
  backpackWallpaper: '/wp6510008-bts-backpack-wallpapers.jpg',
  europeWallpaper: '/wp9087904-4k-eu-wallpapers.jpg',
  worldTravel: '/185289.jpg',
  varanasi:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Varanasi%20ghats%20at%20the%20sunrise.JPG?width=1400',
  gangaAarti:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Ganga%20Aarti%20at%20Dashashwamedh%20Ghat%20Varanasi%2020.jpg?width=1400',
  sarnath:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Dhamek%20stupa%2C%20Sarnath.jpg?width=1400',
  rishikesh:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Ganges%20above%20Rishikesh.jpg?width=1400',
  rishikeshBridge:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Lakshman%20Jhula%20glowing%20in%20the%20sunset%2C%20Rishikesh.jpg?width=1400',
  nepal:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Phewa%20lake%2C%20Pokhara.jpg?width=1400',
  kathmandu:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Boudhanath%20Stupa%20Kathmandu%20Nepal.jpg?width=1400',
  annapurna:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Annapurna%20Sanctuary%20Panorama%20May%202013.jpg?width=1400',
  annapurnaTrail:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Annapurna%20Base%20camp.jpg?width=1400',
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

type JourneyImageInput = Pick<Journey, 'title' | 'category' | 'route'> & {
  subtitle?: string | null
  slug?: string
}

function journeyText(journey?: Partial<JourneyImageInput> | null) {
  return [
    journey?.title,
    journey?.subtitle,
    journey?.route,
    journey?.category,
    journey?.slug,
  ].filter(Boolean).join(' ').toLowerCase()
}

function uniqueImages(images: string[]) {
  return [...new Set(images.filter(Boolean))]
}

export function getJourneyImage(journey?: Pick<Journey, 'title' | 'category' | 'route'> | null) {
  return getJourneyImages(journey)[0] ?? travelImages.spiritual
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

// Returns up to 3 images for a journey card carousel
export function getJourneyImages(journey?: Partial<JourneyImageInput> | null): string[] {
  const text = journeyText(journey)

  if (text.includes('slow ganges') || text.includes('ganges') || text.includes('kashi') || text.includes('varanasi')) {
    return uniqueImages([
      travelImages.varanasi,
      travelImages.gangaAarti,
      travelImages.sarnath,
      travelImages.rishikeshBridge,
      travelImages.rishikesh,
    ])
  }

  if (text.includes('three buddhas') || text.includes('buddha') || text.includes('bodh')) {
    return uniqueImages([
      travelImages.bodhGaya,
      travelImages.sarnath,
      travelImages.lumbini,
      travelImages.kathmandu,
    ])
  }

  if (text.includes('annapurna') || text.includes('abc') || text.includes('hush')) {
    return uniqueImages([
      travelImages.annapurna,
      travelImages.annapurnaTrail,
      travelImages.nepal,
      travelImages.rishikesh,
    ])
  }

  if (text.includes('himalayan') || text.includes('pokhara') || (text.includes('nepal') && !text.includes('lumbini'))) {
    return uniqueImages([travelImages.nepal, travelImages.annapurna, travelImages.kathmandu])
  }

  if (text.includes('lumbini')) {
    return uniqueImages([travelImages.lumbini, travelImages.bodhGaya, travelImages.kathmandu])
  }

  if (text.includes('rishikesh') || text.includes('wellness') || text.includes('yoga')) {
    return uniqueImages([travelImages.rishikeshBridge, travelImages.rishikesh, travelImages.varanasi])
  }

  if (text.includes('heritage')) {
    return uniqueImages([travelImages.bodhGaya, travelImages.sarnath, travelImages.lumbini])
  }

  if (text.includes('adventure')) {
    return uniqueImages([travelImages.annapurna, travelImages.annapurnaTrail, travelImages.nepal])
  }

  return uniqueImages([travelImages.varanasi, travelImages.bodhGaya, travelImages.annapurna])
}

export function getJourneyAttraction(journey?: Partial<JourneyImageInput> | null): string {
  const text = journeyText(journey)

  if (text.includes('slow ganges') || text.includes('kashi') || text.includes('varanasi') || text.includes('ganges')) {
    return 'Varanasi ghats'
  }
  if (text.includes('three buddhas') || text.includes('bodh') || text.includes('buddha')) {
    return 'Mahabodhi Temple'
  }
  if (text.includes('annapurna') || text.includes('abc') || text.includes('hush')) {
    return 'Annapurna Base Camp'
  }
  if (text.includes('lumbini')) return 'Maya Devi Temple'
  if (text.includes('pokhara') || text.includes('himalayan')) return 'Phewa Lake'
  if (text.includes('rishikesh') || text.includes('wellness') || text.includes('yoga')) return 'Rishikesh'

  return 'Best attraction'
}
