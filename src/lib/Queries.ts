export const ratingQuery = `
*[_type == "rating"] | order(publishedAt desc)[0...5] {
  avatar,
  rating,
  message,
  title,
  _id, 
  name,
  location
}
`;

export const propertyQuery = `
*[_type == "property"] | order(_createdAt desc) {  
_id, 
  name,
  location,
  price,
  area,
  bedrooms,
  bathrooms,
  images,
  description,
  keyFeatures,
  amenities,
}
`;

export const shortPropertyQuery = `
*[_type == "property"] | order(price desc)[0...5] { 
 _id, 
  name,
  location,
  price,
  area,
  bedrooms,
  bathrooms,
  images,
  description,
  keyFeatures,
  amenities,
}
`;

export const propertyPriceQuery = `
*[_type == "property"] {price}
`;

export const clientsQuery = `*[_type == "clients"] | order(publishedAt desc) {
  publishedAt,
  domin,
  message,
  title,
  category,
  herf,
  _id
}`;

export const latestClientsQuery = `*[_type == "clients"] | order(publishedAt desc)[0...5] {
  publishedAt,
  domin,
  message,
  title,
  category,
  herf,
  _id
}`;

export const clientsDateQuery = `*[_type == "clients"] {
  publishedAt,
}`;
