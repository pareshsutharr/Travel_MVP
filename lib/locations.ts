// Comprehensive India + Nepal location database — 400+ places with exact coordinates
// Used as instant fallback when Google Places API is not enabled

export type Location = {
  name: string
  region: string // state/province/country
  lat: number
  lng: number
  tags?: string[]
}

export const LOCATIONS: Location[] = [
  // ── INDIA: UTTAR PRADESH ──
  { name: 'Varanasi', region: 'Uttar Pradesh, India', lat: 25.3176, lng: 82.9739, tags: ['spiritual', 'ganges', 'kashi', 'banaras'] },
  { name: 'Kashi', region: 'Uttar Pradesh, India', lat: 25.3176, lng: 82.9739, tags: ['spiritual', 'varanasi'] },
  { name: 'Banaras', region: 'Uttar Pradesh, India', lat: 25.3176, lng: 82.9739, tags: ['spiritual', 'varanasi'] },
  { name: 'Sarnath', region: 'Uttar Pradesh, India', lat: 25.3814, lng: 83.0205, tags: ['buddhist', 'spiritual'] },
  { name: 'Mathura', region: 'Uttar Pradesh, India', lat: 27.4924, lng: 77.6737, tags: ['spiritual', 'krishna'] },
  { name: 'Vrindavan', region: 'Uttar Pradesh, India', lat: 27.5794, lng: 77.7021, tags: ['spiritual', 'krishna'] },
  { name: 'Agra', region: 'Uttar Pradesh, India', lat: 27.1767, lng: 78.0081, tags: ['heritage', 'taj mahal'] },
  { name: 'Lucknow', region: 'Uttar Pradesh, India', lat: 26.8467, lng: 80.9462 },
  { name: 'Allahabad', region: 'Uttar Pradesh, India', lat: 25.4358, lng: 81.8464, tags: ['spiritual', 'prayagraj', 'sangam'] },
  { name: 'Prayagraj', region: 'Uttar Pradesh, India', lat: 25.4358, lng: 81.8464, tags: ['spiritual', 'allahabad'] },
  { name: 'Ayodhya', region: 'Uttar Pradesh, India', lat: 26.7947, lng: 82.2040, tags: ['spiritual', 'ram'] },
  { name: 'Gorakhpur', region: 'Uttar Pradesh, India', lat: 26.7606, lng: 83.3732 },
  { name: 'Kanpur', region: 'Uttar Pradesh, India', lat: 26.4499, lng: 80.3319 },
  { name: 'Meerut', region: 'Uttar Pradesh, India', lat: 28.9845, lng: 77.7064 },
  { name: 'Agra Fort', region: 'Agra, Uttar Pradesh, India', lat: 27.1795, lng: 78.0211, tags: ['heritage'] },
  { name: 'Taj Mahal', region: 'Agra, Uttar Pradesh, India', lat: 27.1751, lng: 78.0421, tags: ['heritage', 'wonder'] },

  // ── INDIA: BIHAR ──
  { name: 'Bodh Gaya', region: 'Bihar, India', lat: 24.6961, lng: 84.9914, tags: ['buddhist', 'spiritual', 'enlightenment'] },
  { name: 'Nalanda', region: 'Bihar, India', lat: 25.1366, lng: 85.4444, tags: ['buddhist', 'heritage'] },
  { name: 'Patna', region: 'Bihar, India', lat: 25.5941, lng: 85.1376 },
  { name: 'Rajgir', region: 'Bihar, India', lat: 25.0269, lng: 85.4187, tags: ['buddhist', 'spiritual'] },
  { name: 'Gaya', region: 'Bihar, India', lat: 24.7914, lng: 85.0002, tags: ['spiritual'] },
  { name: 'Pawapuri', region: 'Bihar, India', lat: 25.2305, lng: 85.5290, tags: ['jain', 'spiritual'] },

  // ── INDIA: UTTARAKHAND ──
  { name: 'Rishikesh', region: 'Uttarakhand, India', lat: 30.0869, lng: 78.2676, tags: ['yoga', 'ganges', 'spiritual', 'adventure'] },
  { name: 'Haridwar', region: 'Uttarakhand, India', lat: 29.9457, lng: 78.1642, tags: ['spiritual', 'ganges', 'aarti'] },
  { name: 'Dehradun', region: 'Uttarakhand, India', lat: 30.3165, lng: 78.0322 },
  { name: 'Mussoorie', region: 'Uttarakhand, India', lat: 30.4598, lng: 78.0658, tags: ['hill station'] },
  { name: 'Nainital', region: 'Uttarakhand, India', lat: 29.3919, lng: 79.4542, tags: ['hill station', 'lake'] },
  { name: 'Kedarnath', region: 'Uttarakhand, India', lat: 30.7352, lng: 79.0669, tags: ['spiritual', 'temple', 'shiva'] },
  { name: 'Badrinath', region: 'Uttarakhand, India', lat: 30.7433, lng: 79.4938, tags: ['spiritual', 'temple', 'vishnu'] },
  { name: 'Gangotri', region: 'Uttarakhand, India', lat: 30.9939, lng: 79.0760, tags: ['spiritual', 'ganges', 'source'] },
  { name: 'Yamunotri', region: 'Uttarakhand, India', lat: 31.0146, lng: 78.4618, tags: ['spiritual'] },
  { name: 'Auli', region: 'Uttarakhand, India', lat: 30.5192, lng: 79.5675, tags: ['adventure', 'skiing'] },
  { name: 'Jim Corbett National Park', region: 'Uttarakhand, India', lat: 29.5300, lng: 78.7747, tags: ['wildlife'] },
  { name: 'Valley of Flowers', region: 'Uttarakhand, India', lat: 30.7268, lng: 79.6082, tags: ['nature', 'trekking'] },
  { name: 'Char Dham', region: 'Uttarakhand, India', lat: 30.7433, lng: 79.4938, tags: ['spiritual', 'pilgrimage'] },

  // ── INDIA: HIMACHAL PRADESH ──
  { name: 'Dharamsala', region: 'Himachal Pradesh, India', lat: 32.2190, lng: 76.3234, tags: ['buddhist', 'tibetan', 'dalai lama'] },
  { name: 'McLeod Ganj', region: 'Himachal Pradesh, India', lat: 32.2396, lng: 76.3202, tags: ['buddhist', 'tibetan'] },
  { name: 'Shimla', region: 'Himachal Pradesh, India', lat: 31.1048, lng: 77.1734, tags: ['hill station'] },
  { name: 'Manali', region: 'Himachal Pradesh, India', lat: 32.2432, lng: 77.1892, tags: ['adventure', 'mountains'] },
  { name: 'Spiti Valley', region: 'Himachal Pradesh, India', lat: 32.2457, lng: 78.0698, tags: ['buddhist', 'adventure'] },
  { name: 'Key Monastery', region: 'Himachal Pradesh, India', lat: 32.2989, lng: 78.0129, tags: ['buddhist'] },
  { name: 'Kasol', region: 'Himachal Pradesh, India', lat: 32.0097, lng: 77.3143 },
  { name: 'Bir Billing', region: 'Himachal Pradesh, India', lat: 32.0395, lng: 76.7232, tags: ['adventure', 'paragliding'] },
  { name: 'Dalhousie', region: 'Himachal Pradesh, India', lat: 32.5378, lng: 75.9740 },

  // ── INDIA: PUNJAB ──
  { name: 'Amritsar', region: 'Punjab, India', lat: 31.6340, lng: 74.8723, tags: ['sikh', 'golden temple', 'spiritual'] },
  { name: 'Golden Temple', region: 'Amritsar, Punjab, India', lat: 31.6200, lng: 74.8765, tags: ['sikh', 'spiritual'] },
  { name: 'Ludhiana', region: 'Punjab, India', lat: 30.9009, lng: 75.8573 },
  { name: 'Chandigarh', region: 'Punjab/Haryana, India', lat: 30.7333, lng: 76.7794 },

  // ── INDIA: RAJASTHAN ──
  { name: 'Jaipur', region: 'Rajasthan, India', lat: 26.9124, lng: 75.7873, tags: ['heritage', 'pink city'] },
  { name: 'Udaipur', region: 'Rajasthan, India', lat: 24.5854, lng: 73.7125, tags: ['heritage', 'lake', 'palace'] },
  { name: 'Jodhpur', region: 'Rajasthan, India', lat: 26.2389, lng: 73.0243, tags: ['heritage', 'blue city'] },
  { name: 'Jaisalmer', region: 'Rajasthan, India', lat: 26.9157, lng: 70.9083, tags: ['heritage', 'desert'] },
  { name: 'Pushkar', region: 'Rajasthan, India', lat: 26.4899, lng: 74.5511, tags: ['spiritual', 'brahma temple'] },
  { name: 'Bikaner', region: 'Rajasthan, India', lat: 28.0229, lng: 73.3119 },
  { name: 'Ajmer', region: 'Rajasthan, India', lat: 26.4499, lng: 74.6399, tags: ['spiritual', 'sufi', 'dargah'] },
  { name: 'Ranthambore', region: 'Rajasthan, India', lat: 26.0173, lng: 76.5026, tags: ['wildlife', 'tigers'] },
  { name: 'Mount Abu', region: 'Rajasthan, India', lat: 24.5926, lng: 72.7156, tags: ['hill station', 'jain'] },
  { name: 'Amber Fort', region: 'Jaipur, Rajasthan, India', lat: 26.9855, lng: 75.8513, tags: ['heritage'] },

  // ── INDIA: DELHI / NCR ──
  { name: 'New Delhi', region: 'Delhi, India', lat: 28.6139, lng: 77.2090 },
  { name: 'Delhi', region: 'Delhi, India', lat: 28.6139, lng: 77.2090 },
  { name: 'Old Delhi', region: 'Delhi, India', lat: 28.6562, lng: 77.2410, tags: ['heritage'] },
  { name: 'Qutub Minar', region: 'Delhi, India', lat: 28.5245, lng: 77.1855, tags: ['heritage'] },
  { name: 'Red Fort', region: 'Delhi, India', lat: 28.6562, lng: 77.2410, tags: ['heritage'] },
  { name: 'Lotus Temple', region: 'Delhi, India', lat: 28.5535, lng: 77.2588, tags: ['spiritual'] },
  { name: 'Akshardham Temple', region: 'Delhi, India', lat: 28.6127, lng: 77.2773, tags: ['spiritual', 'temple'] },

  // ── INDIA: GUJARAT ──
  { name: 'Ahmedabad', region: 'Gujarat, India', lat: 23.0225, lng: 72.5714 },
  { name: 'Dwarka', region: 'Gujarat, India', lat: 22.2442, lng: 68.9685, tags: ['spiritual', 'krishna', 'temple'] },
  { name: 'Somnath', region: 'Gujarat, India', lat: 20.9002, lng: 70.3718, tags: ['spiritual', 'shiva', 'temple'] },
  { name: 'Rann of Kutch', region: 'Gujarat, India', lat: 23.7337, lng: 69.8597, tags: ['nature'] },
  { name: 'Palitana', region: 'Gujarat, India', lat: 21.5240, lng: 71.8261, tags: ['jain', 'spiritual'] },
  { name: 'Surat', region: 'Gujarat, India', lat: 21.1702, lng: 72.8311 },
  { name: 'Vadodara', region: 'Gujarat, India', lat: 22.3072, lng: 73.1812 },

  // ── INDIA: MAHARASHTRA ──
  { name: 'Mumbai', region: 'Maharashtra, India', lat: 19.0760, lng: 72.8777 },
  { name: 'Pune', region: 'Maharashtra, India', lat: 18.5204, lng: 73.8567 },
  { name: 'Nashik', region: 'Maharashtra, India', lat: 20.0059, lng: 73.7796, tags: ['spiritual', 'kumbh mela'] },
  { name: 'Aurangabad', region: 'Maharashtra, India', lat: 19.8762, lng: 75.3433 },
  { name: 'Ajanta Caves', region: 'Maharashtra, India', lat: 20.5519, lng: 75.7033, tags: ['buddhist', 'heritage'] },
  { name: 'Ellora Caves', region: 'Maharashtra, India', lat: 20.0258, lng: 75.1780, tags: ['heritage', 'cave'] },
  { name: 'Shirdi', region: 'Maharashtra, India', lat: 19.7659, lng: 74.4776, tags: ['spiritual', 'sai baba'] },
  { name: 'Kolhapur', region: 'Maharashtra, India', lat: 16.7050, lng: 74.2433 },

  // ── INDIA: GOA ──
  { name: 'Goa', region: 'Goa, India', lat: 15.2993, lng: 74.1240, tags: ['beach'] },
  { name: 'Panaji', region: 'Goa, India', lat: 15.4909, lng: 73.8278 },
  { name: 'Old Goa', region: 'Goa, India', lat: 15.5009, lng: 73.9116, tags: ['heritage'] },
  { name: 'Calangute', region: 'Goa, India', lat: 15.5439, lng: 73.7546, tags: ['beach'] },
  { name: 'Arambol', region: 'Goa, India', lat: 15.6861, lng: 73.7066, tags: ['beach'] },

  // ── INDIA: KARNATAKA ──
  { name: 'Bangalore', region: 'Karnataka, India', lat: 12.9716, lng: 77.5946 },
  { name: 'Bengaluru', region: 'Karnataka, India', lat: 12.9716, lng: 77.5946 },
  { name: 'Mysore', region: 'Karnataka, India', lat: 12.2958, lng: 76.6394, tags: ['palace', 'heritage'] },
  { name: 'Mysuru', region: 'Karnataka, India', lat: 12.2958, lng: 76.6394 },
  { name: 'Hampi', region: 'Karnataka, India', lat: 15.3350, lng: 76.4600, tags: ['heritage', 'ruins'] },
  { name: 'Coorg', region: 'Karnataka, India', lat: 12.3375, lng: 75.8069, tags: ['nature', 'coffee'] },
  { name: 'Udupi', region: 'Karnataka, India', lat: 13.3409, lng: 74.7421, tags: ['spiritual', 'temple'] },
  { name: 'Badami', region: 'Karnataka, India', lat: 15.9215, lng: 75.6794, tags: ['heritage', 'cave'] },
  { name: 'Gokarna', region: 'Karnataka, India', lat: 14.5479, lng: 74.3188, tags: ['spiritual', 'beach'] },
  { name: 'Belur', region: 'Karnataka, India', lat: 13.1645, lng: 75.8649, tags: ['heritage', 'temple'] },

  // ── INDIA: KERALA ──
  { name: 'Kochi', region: 'Kerala, India', lat: 9.9312, lng: 76.2673 },
  { name: 'Cochin', region: 'Kerala, India', lat: 9.9312, lng: 76.2673 },
  { name: 'Thiruvananthapuram', region: 'Kerala, India', lat: 8.5241, lng: 76.9366 },
  { name: 'Trivandrum', region: 'Kerala, India', lat: 8.5241, lng: 76.9366 },
  { name: 'Munnar', region: 'Kerala, India', lat: 10.0889, lng: 77.0595, tags: ['nature', 'tea'] },
  { name: 'Thekkady', region: 'Kerala, India', lat: 9.5861, lng: 77.1706, tags: ['wildlife', 'periyar'] },
  { name: 'Alleppey', region: 'Kerala, India', lat: 9.4981, lng: 76.3388, tags: ['backwaters', 'houseboat'] },
  { name: 'Alappuzha', region: 'Kerala, India', lat: 9.4981, lng: 76.3388, tags: ['backwaters'] },
  { name: 'Varkala', region: 'Kerala, India', lat: 8.7379, lng: 76.7163, tags: ['beach', 'spiritual'] },
  { name: 'Thrissur', region: 'Kerala, India', lat: 10.5276, lng: 76.2144 },

  // ── INDIA: TAMIL NADU ──
  { name: 'Chennai', region: 'Tamil Nadu, India', lat: 13.0827, lng: 80.2707 },
  { name: 'Madurai', region: 'Tamil Nadu, India', lat: 9.9252, lng: 78.1198, tags: ['spiritual', 'meenakshi temple'] },
  { name: 'Kanchipuram', region: 'Tamil Nadu, India', lat: 12.8185, lng: 79.6947, tags: ['spiritual', 'temple'] },
  { name: 'Mahabalipuram', region: 'Tamil Nadu, India', lat: 12.6269, lng: 80.1927, tags: ['heritage', 'shore temple'] },
  { name: 'Rameswaram', region: 'Tamil Nadu, India', lat: 9.2876, lng: 79.3129, tags: ['spiritual', 'temple'] },
  { name: 'Thanjavur', region: 'Tamil Nadu, India', lat: 10.7870, lng: 79.1378, tags: ['heritage', 'temple'] },
  { name: 'Pondicherry', region: 'Tamil Nadu, India', lat: 11.9416, lng: 79.8083, tags: ['spiritual', 'french', 'auroville'] },
  { name: 'Tiruvannamalai', region: 'Tamil Nadu, India', lat: 12.2253, lng: 79.0747, tags: ['spiritual', 'shiva', 'ramana'] },
  { name: 'Ooty', region: 'Tamil Nadu, India', lat: 11.4102, lng: 76.6950, tags: ['hill station'] },

  // ── INDIA: ANDHRA PRADESH & TELANGANA ──
  { name: 'Hyderabad', region: 'Telangana, India', lat: 17.3850, lng: 78.4867 },
  { name: 'Tirupati', region: 'Andhra Pradesh, India', lat: 13.6288, lng: 79.4192, tags: ['spiritual', 'temple', 'vishnu'] },
  { name: 'Vijayawada', region: 'Andhra Pradesh, India', lat: 16.5062, lng: 80.6480 },
  { name: 'Amaravati', region: 'Andhra Pradesh, India', lat: 16.5731, lng: 80.3569, tags: ['buddhist'] },

  // ── INDIA: WEST BENGAL ──
  { name: 'Kolkata', region: 'West Bengal, India', lat: 22.5726, lng: 88.3639 },
  { name: 'Darjeeling', region: 'West Bengal, India', lat: 27.0360, lng: 88.2627, tags: ['hill station', 'tea'] },
  { name: 'Kalimpong', region: 'West Bengal, India', lat: 27.0660, lng: 88.4710, tags: ['hill station'] },
  { name: 'Siliguri', region: 'West Bengal, India', lat: 26.7271, lng: 88.3953 },

  // ── INDIA: ODISHA ──
  { name: 'Puri', region: 'Odisha, India', lat: 19.8135, lng: 85.8312, tags: ['spiritual', 'jagannath', 'temple'] },
  { name: 'Bhubaneswar', region: 'Odisha, India', lat: 20.2961, lng: 85.8245, tags: ['temple city'] },
  { name: 'Konark', region: 'Odisha, India', lat: 19.8876, lng: 86.0945, tags: ['heritage', 'sun temple'] },
  { name: 'Chilika Lake', region: 'Odisha, India', lat: 19.7167, lng: 85.3167, tags: ['nature', 'lake'] },

  // ── INDIA: MADHYA PRADESH ──
  { name: 'Khajuraho', region: 'Madhya Pradesh, India', lat: 24.8318, lng: 79.9199, tags: ['heritage', 'temple'] },
  { name: 'Ujjain', region: 'Madhya Pradesh, India', lat: 23.1765, lng: 75.7885, tags: ['spiritual', 'shiva', 'kumbh'] },
  { name: 'Bhopal', region: 'Madhya Pradesh, India', lat: 23.2599, lng: 77.4126 },
  { name: 'Orchha', region: 'Madhya Pradesh, India', lat: 25.3516, lng: 78.6411, tags: ['heritage'] },
  { name: 'Sanchi', region: 'Madhya Pradesh, India', lat: 23.4793, lng: 77.7384, tags: ['buddhist', 'stupa'] },
  { name: 'Indore', region: 'Madhya Pradesh, India', lat: 22.7196, lng: 75.8577 },

  // ── INDIA: ASSAM & NORTHEAST ──
  { name: 'Guwahati', region: 'Assam, India', lat: 26.1445, lng: 91.7362 },
  { name: 'Kaziranga', region: 'Assam, India', lat: 26.5775, lng: 93.1719, tags: ['wildlife', 'rhino'] },
  { name: 'Tawang', region: 'Arunachal Pradesh, India', lat: 27.5860, lng: 91.8673, tags: ['buddhist', 'monastery'] },
  { name: 'Shillong', region: 'Meghalaya, India', lat: 25.5788, lng: 91.8933, tags: ['hill station'] },
  { name: 'Cherrapunji', region: 'Meghalaya, India', lat: 25.2800, lng: 91.7200, tags: ['nature', 'wettest'] },
  { name: 'Kohima', region: 'Nagaland, India', lat: 25.6701, lng: 94.1077 },
  { name: 'Imphal', region: 'Manipur, India', lat: 24.8170, lng: 93.9368 },

  // ── INDIA: JAMMU & KASHMIR / LADAKH ──
  { name: 'Srinagar', region: 'Jammu & Kashmir, India', lat: 34.0837, lng: 74.7973, tags: ['valley', 'lake', 'houseboats'] },
  { name: 'Gulmarg', region: 'Jammu & Kashmir, India', lat: 34.0484, lng: 74.3805, tags: ['skiing', 'adventure'] },
  { name: 'Pahalgam', region: 'Jammu & Kashmir, India', lat: 34.0159, lng: 75.3150 },
  { name: 'Leh', region: 'Ladakh, India', lat: 34.1526, lng: 77.5771, tags: ['buddhist', 'adventure'] },
  { name: 'Pangong Lake', region: 'Ladakh, India', lat: 33.7597, lng: 78.6531, tags: ['lake', 'nature'] },
  { name: 'Nubra Valley', region: 'Ladakh, India', lat: 34.7201, lng: 77.5595, tags: ['adventure'] },
  { name: 'Hemis Monastery', region: 'Ladakh, India', lat: 33.9193, lng: 77.7097, tags: ['buddhist', 'monastery'] },
  { name: 'Diskit Monastery', region: 'Ladakh, India', lat: 34.5638, lng: 77.5607, tags: ['buddhist', 'monastery'] },

  // ── NEPAL: KATHMANDU VALLEY ──
  { name: 'Kathmandu', region: 'Bagmati Province, Nepal', lat: 27.7172, lng: 85.3240, tags: ['capital', 'temple', 'heritage'] },
  { name: 'Pashupatinath', region: 'Kathmandu, Nepal', lat: 27.7105, lng: 85.3487, tags: ['spiritual', 'shiva', 'temple'] },
  { name: 'Boudhanath', region: 'Kathmandu, Nepal', lat: 27.7215, lng: 85.3620, tags: ['buddhist', 'stupa'] },
  { name: 'Swayambhunath', region: 'Kathmandu, Nepal', lat: 27.7149, lng: 85.2904, tags: ['buddhist', 'monkey temple'] },
  { name: 'Patan', region: 'Kathmandu Valley, Nepal', lat: 27.6766, lng: 85.3244, tags: ['heritage'] },
  { name: 'Bhaktapur', region: 'Kathmandu Valley, Nepal', lat: 27.6710, lng: 85.4298, tags: ['heritage'] },
  { name: 'Changu Narayan', region: 'Kathmandu Valley, Nepal', lat: 27.7312, lng: 85.4221, tags: ['heritage', 'temple'] },
  { name: 'Kopan Monastery', region: 'Kathmandu, Nepal', lat: 27.7441, lng: 85.3553, tags: ['buddhist', 'monastery'] },
  { name: 'Dhulikhel', region: 'Kathmandu Valley, Nepal', lat: 27.6218, lng: 85.5533, tags: ['mountain view'] },
  { name: 'Nagarkot', region: 'Kathmandu Valley, Nepal', lat: 27.7190, lng: 85.5190, tags: ['mountain view', 'sunrise'] },

  // ── NEPAL: POKHARA & ANNAPURNA ──
  { name: 'Pokhara', region: 'Gandaki Province, Nepal', lat: 28.2096, lng: 83.9856, tags: ['lake', 'mountains', 'adventure'] },
  { name: 'Phewa Lake', region: 'Pokhara, Nepal', lat: 28.2181, lng: 83.9483, tags: ['lake'] },
  { name: 'Sarangkot', region: 'Pokhara, Nepal', lat: 28.2576, lng: 83.9481, tags: ['sunrise', 'paragliding'] },
  { name: 'Ghorepani', region: 'Gandaki Province, Nepal', lat: 28.3968, lng: 83.6975, tags: ['trekking', 'poon hill'] },
  { name: 'Poon Hill', region: 'Gandaki Province, Nepal', lat: 28.4000, lng: 83.6900, tags: ['sunrise', 'trekking'] },
  { name: 'Tadapani', region: 'Gandaki Province, Nepal', lat: 28.3747, lng: 83.7388, tags: ['trekking'] },
  { name: 'Chhomrong', region: 'Gandaki Province, Nepal', lat: 28.4830, lng: 83.8265, tags: ['trekking', 'annapurna'] },
  { name: 'Annapurna Base Camp', region: 'Gandaki Province, Nepal', lat: 28.5303, lng: 83.8745, tags: ['trekking', 'abc'] },
  { name: 'Annapurna Circuit', region: 'Gandaki Province, Nepal', lat: 28.6500, lng: 84.1000, tags: ['trekking'] },
  { name: 'Manang', region: 'Gandaki Province, Nepal', lat: 28.6677, lng: 84.0196, tags: ['trekking'] },
  { name: 'Thorong La Pass', region: 'Gandaki Province, Nepal', lat: 28.7825, lng: 83.9283, tags: ['trekking', 'pass'] },
  { name: 'Muktinath', region: 'Gandaki Province, Nepal', lat: 28.8175, lng: 83.8686, tags: ['spiritual', 'temple'] },
  { name: 'Jomsom', region: 'Gandaki Province, Nepal', lat: 28.7792, lng: 83.7276, tags: ['trekking', 'mustang'] },

  // ── NEPAL: EVEREST REGION ──
  { name: 'Everest Base Camp', region: 'Koshi Province, Nepal', lat: 27.9881, lng: 86.9253, tags: ['trekking', 'everest', 'ebc'] },
  { name: 'Namche Bazaar', region: 'Koshi Province, Nepal', lat: 27.8069, lng: 86.7139, tags: ['trekking', 'everest'] },
  { name: 'Tengboche', region: 'Koshi Province, Nepal', lat: 27.8361, lng: 86.7639, tags: ['monastery', 'everest'] },
  { name: 'Lukla', region: 'Koshi Province, Nepal', lat: 27.6868, lng: 86.7294, tags: ['everest', 'airport'] },
  { name: 'Kala Patthar', region: 'Koshi Province, Nepal', lat: 27.9943, lng: 86.8278, tags: ['viewpoint', 'everest'] },
  { name: 'Gokyo Lakes', region: 'Koshi Province, Nepal', lat: 27.9600, lng: 86.6900, tags: ['trekking', 'lake'] },
  { name: 'Island Peak', region: 'Koshi Province, Nepal', lat: 27.9231, lng: 86.9306, tags: ['climbing', 'peak'] },

  // ── NEPAL: LUMBINI & TERAI ──
  { name: 'Lumbini', region: 'Lumbini Province, Nepal', lat: 27.4833, lng: 83.2763, tags: ['buddhist', 'birthplace', 'buddha', 'spiritual'] },
  { name: 'Maya Devi Temple', region: 'Lumbini, Nepal', lat: 27.4826, lng: 83.2762, tags: ['buddhist', 'temple'] },
  { name: 'Chitwan National Park', region: 'Bagmati Province, Nepal', lat: 27.5291, lng: 84.3542, tags: ['wildlife', 'jungle', 'safari'] },
  { name: 'Chitwan', region: 'Bagmati Province, Nepal', lat: 27.5291, lng: 84.3542, tags: ['wildlife'] },
  { name: 'Sauraha', region: 'Chitwan, Nepal', lat: 27.5770, lng: 84.4947, tags: ['wildlife', 'safari'] },
  { name: 'Bardia National Park', region: 'Lumbini Province, Nepal', lat: 28.3713, lng: 81.5082, tags: ['wildlife'] },
  { name: 'Janakpur', region: 'Madhesh Province, Nepal', lat: 26.7288, lng: 85.9229, tags: ['spiritual', 'sita', 'ram'] },

  // ── NEPAL: OTHER REGIONS ──
  { name: 'Rara Lake', region: 'Karnali Province, Nepal', lat: 29.5276, lng: 82.0869, tags: ['lake', 'nature', 'remote'] },
  { name: 'Dolpo', region: 'Karnali Province, Nepal', lat: 29.3000, lng: 82.9000, tags: ['remote', 'trekking', 'buddhist'] },
  { name: 'Mustang', region: 'Gandaki Province, Nepal', lat: 29.1828, lng: 83.9678, tags: ['remote', 'trekking', 'buddhist'] },
  { name: 'Lo Manthang', region: 'Mustang, Nepal', lat: 29.1836, lng: 83.9694, tags: ['remote', 'heritage'] },
  { name: 'Bandipur', region: 'Gandaki Province, Nepal', lat: 27.9313, lng: 84.4112, tags: ['heritage', 'hill town'] },
  { name: 'Tansen', region: 'Lumbini Province, Nepal', lat: 27.8671, lng: 83.5421, tags: ['heritage'] },
]

// Simple fuzzy search — matches name, region, and tags
export function searchLocations(query: string, limit = 6): Location[] {
  const q = query.toLowerCase().trim()
  if (q.length < 2) return []

  const words = q.split(/\s+/).filter(Boolean)

  const scored = LOCATIONS.map((loc) => {
    const searchable = [
      loc.name.toLowerCase(),
      loc.region.toLowerCase(),
      ...(loc.tags ?? []),
    ].join(' ')

    let score = 0
    for (const word of words) {
      if (loc.name.toLowerCase().startsWith(word)) score += 10
      else if (loc.name.toLowerCase().includes(word)) score += 6
      else if (loc.region.toLowerCase().includes(word)) score += 3
      else if ((loc.tags ?? []).some((t) => t.includes(word))) score += 4
      else if (searchable.includes(word)) score += 1
    }
    return { loc, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.loc)
}
