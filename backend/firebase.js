const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY); // Firebase Service Account
// const serviceAccount = require('./JSON/sr-data-comparision-firebase-adminsdk-hvic2-5af68d1de9firebase.json'); // Firebase Service Account

// Initialize Firebase Admin SDK
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const checkAllDateTime = async () => {
	const collectionRef = admin.firestore().collection('myCollection'); // Replace with your collection name

	console.log('Checking all date and time values in the collection...');

	try {
		const snapshot = await collectionRef.get();
		if (snapshot.empty) {
			console.log('No documents found in the collection.');
			return {
				message: 'No documents found in the collection.',
				results: [],
			};
		}

		console.log(
			`Found ${snapshot.docs.length} documents in the collection.`
		);

		const results = []; // Array to hold the results
		snapshot.forEach(doc => {
			const data = doc.data();
			const { name, date, time } = data;

			// Ensure date and time are in the expected format
			const inputDateTimeString = `${date} ${time}`;
			const inputDateTime = new Date(`${inputDateTimeString} UTC`);

			console.log(
				`Document ${doc.id}: Input date and time: ${inputDateTimeString}`
			);

			// Set the reference date and time for comparison
			const referenceDateTimeString = '03-10-2024 05:00';
			const referenceDateTime = new Date(
				`${referenceDateTimeString} UTC`
			);

			console.log(
				`Document ${doc.id}: Reference date and time: ${referenceDateTimeString}`
			);

			// Compare the two date and time values
			if (inputDateTime > referenceDateTime) {
				console.log(`Name: ${name}`);
				results.push(`Name: ${name}`);
			} else {
				console.log(
					`Document ${doc.id}: Date and time are not greater than the reference.`
				);
			}
		});

		return { message: 'Check completed', results };
	} catch (error) {
		console.error('Error getting documents: ', error);
		throw new Error('Error getting documents: ' + error.message);
	}
};
module.exports = { checkAllDateTime }; // Export the function
