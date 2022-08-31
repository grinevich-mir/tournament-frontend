import sanityClient from '@sanity/client';

export default sanityClient({
  // Find your project ID and dataset in `sanity.json` in your studio project
  projectId: 'vfsprgfp',
  // dataset: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  dataset: process.env.VUE_APP_CMS_DATASET || 'production',
  // useCdn: process.env.NODE_ENV === 'production',
  useCdn: true,
  // useCdn == true gives fast, cheap responses using a globally distributed cache.
  // Set this to false if your application require the freshest possible
  // data always (potentially slightly slower and a bit more expensive).
  apiVersion: '2021-10-19', // use a UTC date string
});
