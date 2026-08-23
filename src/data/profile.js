import { getAvatarArt } from '../utils/placeholderArt';

export const CURRENT_USER = {
  name: 'Ahmed Al-Sulaiti',
  nameAr: 'أحمد السليطي',
  email: 'ahmed.alsulaiti@example.com',
  avatar: getAvatarArt('ahmed-profile'),
  plan: 'premium',
};

export const PROFILES = [
  { id: 'p1', name: 'Ahmed', avatar: getAvatarArt('ahmed-profile') },
  { id: 'p2', name: 'Fatima', avatar: getAvatarArt('fatima-profile') },
  { id: 'p3', name: 'Kids', avatar: getAvatarArt('kids-profile'), kids: true },
];
