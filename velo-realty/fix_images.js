const fs = require('fs');
const siteDataPath = './src/data/siteData.ts';
const sectionsPath = './src/components/Sections.tsx';

let siteData = fs.readFileSync(siteDataPath, 'utf8');

const images = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tokyo_Sky_Tree_2012.JPG/800px-Tokyo_Sky_Tree_2012.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Burj_Khalifa.jpg/800px-Burj_Khalifa.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/One_World_Trade_Center_from_base.jpg/800px-One_World_Trade_Center_from_base.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg/800px-A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Shanghai_skyline_from_the_bund.jpg/800px-Shanghai_skyline_from_the_bund.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Singapore_skyline_from_Marina_Bay.jpg/800px-Singapore_skyline_from_Marina_Bay.jpg'
];

let counter = 0;
siteData = siteData.replace(/https:\/\/picsum\.photos\/seed\/[^']+/g, () => {
  return images[(counter++) % images.length];
});

fs.writeFileSync(siteDataPath, siteData);

let sections = fs.readFileSync(sectionsPath, 'utf8');
sections = sections.replace(/https:\/\/picsum\.photos\/seed\/vikram\/[^']+/g, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Pierre-Person.jpg/800px-Pierre-Person.jpg');
sections = sections.replace(/https:\/\/picsum\.photos\/seed\/ananya\/[^']+/g, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Sheryl_Sandberg_World_Economic_Forum_Annual_Meeting_Davos_2013.jpg/800px-Sheryl_Sandberg_World_Economic_Forum_Annual_Meeting_Davos_2013.jpg');
sections = sections.replace(/https:\/\/picsum\.photos\/seed\/siddharth\/[^']+/g, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Satya_Nadella_by_Brian_Smale.jpg/800px-Satya_Nadella_by_Brian_Smale.jpg');
sections = sections.replace(/https:\/\/picsum\.photos\/seed\/priya\/[^']+/g, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Indra_Nooyi_2016.jpg/800px-Indra_Nooyi_2016.jpg');

fs.writeFileSync(sectionsPath, sections);

console.log('Fixed images.');
