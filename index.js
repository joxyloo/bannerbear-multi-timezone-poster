const { Bannerbear } = require('bannerbear');

const BANNERBEAR_API = 'your_api_key';
const TEMPLATE_ID = 'your_template_id';
// Time zone and the time; you can pull this from your data source
const fromTimeZoneOffset = 8; // GMT +8
const timeInput = '12:30'; // Time in GMT+8
const dateInput = 'December 23, 2024';
const targetTimeZones = [
  'Asia/Bangkok', // GMT +7
  'Asia/Dhaka', // GMT +6
  'America/New_York', // EST
];

function convertTimeToTimeZone(time, date, fromOffset, toTimeZone) {
  const [hours, minutes] = time.split(':').map(Number);
  const [month, day, year] = date.replace(',', '').split(' ');

  // Convert the month name to a month number
  const monthNumber = new Date(`${month} 1`).getMonth();

  // Create a Date object representing the time in UTC
  const utcDate = new Date(Date.UTC(year, monthNumber, day, hours - fromOffset, minutes));

  // Format the date and time in the target time zone
  const options = {
    timeZone: toTimeZone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  };

  return new Intl.DateTimeFormat('en-US', options).format(utcDate).replace('at', '|');
}

(async () => {
  targetTimeZones.forEach(async (toTimeZone) => {
    const convertedTime = convertTimeToTimeZone(timeInput, dateInput, fromTimeZoneOffset, toTimeZone);

    const bb = new Bannerbear(BANNERBEAR_API);
    const images = await bb.create_image(
      TEMPLATE_ID,
      {
        modifications: [
          {
            name: 'dateandtime',
            text: convertedTime,
          },
        ],
      },
      true
    );

    console.log(images.image_url);
  });
})();
