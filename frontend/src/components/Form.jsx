import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
// import { db } from '../firebaseConfig';
// import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const NotificationSignupPage = ({ long, lat, calendarData }) => {
	const [activeTab, setActiveTab] = useState('realtime');

	const renderTabs = () => {
		return (
			<div className="tabs flex mb-4">
				<button
					className={`tab flex-1 py-2 px-4 text-center rounded-t-lg ${activeTab === 'realtime'
						? 'bg-white text-black shadow-md'
						: 'bg-gray-200 text-gray-600'
						}`}
					onClick={() => setActiveTab('realtime')}>
					Realtime Notification
				</button>
				<button
					className={`tab flex-1 py-2 px-4 text-center rounded-t-lg ${activeTab === 'whatsapp'
						? 'bg-white text-black shadow-md'
						: 'bg-gray-200 text-gray-600'
						}`}
					onClick={() => setActiveTab('whatsapp')}>
					WhatsApp SR-bot
				</button>
			</div>
		);
	};

	const renderContent = () => {
		if (activeTab === 'realtime') {
			return (
				<RealtimeNotificationForm
					long={long}
					lat={lat}
				/>
			);
		} else if (activeTab === 'whatsapp') {
			return <WhatsAppSRTutorial />;
		}
	};

	return (
		<div className="notification-signup-page h-full p-4">
			{renderTabs()}
			<div className="content bg-white p-4 rounded-lg shadow-lg">
				{renderContent()}
			</div>
		</div>
	);
};
const RealtimeNotificationForm = ({ long, lat }) => {
	const {
		register,
		handleSubmit,
		setError,
		reset,
		formState: { errors },
	} = useForm();

	const onSubmit = async data => {
		// const fullMobileNumber = data.mobile;
		// // Check if the mobile number already exists
		// const q = query(
		// 	collection(db, 'users'),
		// 	where('mobile', '==', fullMobileNumber)
		// );
		// const querySnapshot = await getDocs(q);
		// if (!querySnapshot.empty) {
		// 	setError('mobile', {
		// 		type: 'manual',
		// 		message: 'This mobile number is already registered.',
		// 	});
		// 	return;
		// }
		// try {
		// 	await addDoc(collection(db, 'users'), {
		// 		name: data.name,
		// 		email: data.email,
		// 		mobile: fullMobileNumber,
		// 		lt: lat,
		// 		ln: long,
		// 		leadTimeDays: data.leadTimeDays,
		// 		leadTimeHours: data.leadTimeHours,
		// 	});
		// 	console.log('Document successfully written!');
		// 	reset();
		// } catch (error) {
		// 	console.error('Error adding document: ', error);
		// 	setError('submit', {
		// 		type: 'manual',
		// 		message: 'Error adding user. Please try again.',
		// 	});
		// }
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
			<h2 className="text-xl font-bold mb-4">
				Sign up for SMS and email notifications, and get notified at a
				specified lead time before the overpass of the satellite for
				your locked location.
			</h2>
			{errors.submit && (
				<p className="text-red-500">{errors.submit.message}</p>
			)}
			<div className="mb-4">
				<label className="block mb-2 text-gray-700">Name</label>
				<input
					type="text"
					{...register('name', { required: 'Name is required' })}
					className={`border rounded px-3 py-2 w-full ${errors.name ? 'border-red-500' : ''
						}`}
				/>
				{errors.name && (
					<p className="text-red-500">{errors.name.message}</p>
				)}
			</div>
			<div className="mb-4">
				<label className="block mb-2 text-gray-700">Email</label>
				<input
					type="email"
					{...register('email', { required: 'Email is required' })}
					className={`border rounded px-3 py-2 w-full ${errors.email ? 'border-red-500' : ''
						}`}
				/>
				{errors.email && (
					<p className="text-red-500">{errors.email.message}</p>
				)}
			</div>
			<div className="mb-4">
				<label className="block mb-2 text-gray-700">
					Mobile (for SMS notifications outside of the US)
				</label>
				<PhoneInput
					international
					defaultCountry="IN"
					{...register(
						'mobile (for SMS notifications outside of the US)',
						{
							required: 'Mobile number is required',
						}
					)}
					className={`border rounded px-3 py-2 w-full ${errors.mobile ? 'border-red-500' : ''
						}`}
				/>
				{errors.mobile && (
					<p className="text-red-500">{errors.mobile.message}</p>
				)}
			</div>
			<div className="mb-4">
				<label className="block mb-2 text-gray-700">
					Lead Time for Notification
				</label>
				<div className="flex space-x-4">
					<div>
						<header className="text-gray-700 text-sm font-bold">
							Days
						</header>
						<input
							type="number"
							min="0"
							max="2"
							{...register('leadTimeDays', {
								required: 'Days are required',
							})}
							className={`border rounded px-3 py-2 w-full ${errors.leadTimeDays ? 'border-red-500' : ''
								}`}
							placeholder="Days"
						/>
						{errors.leadTimeDays && (
							<p className="text-red-500">
								{errors.leadTimeDays.message}
							</p>
						)}
					</div>
					<div>
						<header className="text-gray-700 text-sm font-bold">
							Hours
						</header>
						<input
							type="number"
							min="0"
							max="24"
							{...register('leadTimeHours', {
								required: 'Hours are required',
							})}
							className={`border rounded px-3 py-2 w-full ${errors.leadTimeHours ? 'border-red-500' : ''
								}`}
							placeholder="Hours"
						/>
						{errors.leadTimeHours && (
							<p className="text-red-500">
								{errors.leadTimeHours.message}
							</p>
						)}
					</div>
				</div>
			</div>
			<button
				type="submit"
				className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
				Submit
			</button>
		</form>
	);
};

const WhatsAppSRTutorial = () => {
	return (
		<div className="whatsapp-sr-tutorial p-6 bg-white shadow-md rounded-lg flex flex-col space-y-6 md:space-y-4 lg:p-8">
			<div className="w-full flex justify-center">
				<h2 className="text-3xl font-bold mb-2">WhatsApp SR-bot Tutorial</h2>
			</div>
			<div className="w-full flex justify-center">
				<h3 className="text-2xl font-bold mb-1">What is SR-BOT?</h3>
			</div>
			<div className="w-full flex justify-center">
				<p className="mb-4 text-center max-w-prose">
					SR-BOT is a cutting-edge conversational assistant that is available on your WhatsApp for more than just timely notifications of satellite overpasses. With SR-BOT, you can ask about SR data for a particular location, know about the next satellite overpass, and even receive SR data right in your WhatsApp inbox. It's a powerful tool that allows you to get the information you need quickly and easily.
				</p>
			</div>
			<div className="flex flex-col md:flex-row md:space-x-4">
				<div className="w-full md:w-1/2 mb-4 md:mb-0">
					<h3 className="text-2xl font-bold mb-2">Method 1</h3>
					<ol className="list-decimal list-inside space-y-2">
						<li>
							Save the number <strong>+1 415 523 8886</strong> to your contacts.
						</li>
						<li>
							Send the message <strong>"join own-already"</strong> to the number on WhatsApp.
						</li>
						<li>
							You will receive a confirmation message indicating that you have successfully connected to SR-BOT.
						</li>
						<li>
							Then, you will receive further instructions on how to use SR-BOT directly in WhatsApp.
						</li>
					</ol>
				</div>
				<div className="w-full md:w-1/2 flex flex-col items-center">
					<h3 className="text-2xl font-bold mb-2">Method 2</h3>
					<img
						src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2033%2033%22%20shape-rendering%3D%22crispEdges%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M0%200h33v33H0z%22%2F%3E%3Cpath%20stroke%3D%22%23000000%22%20d%3D%22M0%200.5h7m1%200h2m2%200h6m1%200h1m3%200h2m1%200h7M0%201.5h1m5%200h1m1%200h1m2%200h3m1%200h1m2%200h1m1%200h1m2%200h2m1%200h1m5%200h1M0%202.5h1m1%200h3m1%200h1m2%200h1m2%200h1m4%200h1m1%200h1m1%200h4m1%200h1m1%200h3m1%200h1M0%203.5h1m1%200h3m1%200h1m1%200h2m2%200h1m1%200h3m2%200h2m1%200h3m1%200h1m1%200h3m1%200h1M0%204.5h1m1%200h3m1%200h1m2%200h1m3%200h2m2%200h1m2%200h5m1%200h1m1%200h3m1%200h1M0%205.5h1m5%200h1m4%200h2m1%200h1m4%200h5m2%200h1m5%200h1M0%206.5h7m1%200h1m1%200h1m1%200h1m1%200h1m1%200h1m1%200h1m1%200h1m1%200h1m1%200h1m1%200h7M8%207.5h3m1%200h3m2%200h1m2%200h1m1%200h1M0%208.5h1m1%200h2m1%200h3m2%200h1m2%200h2m2%200h3m2%200h1m3%200h1m2%200h1m1%200h2M1%209.5h1m1%200h3m1%200h3m1%200h1m2%200h3m3%200h7m2%200h2m1%200h1M0%2010.5h1m1%200h1m2%200h7m2%200h2m1%200h1m1%200h3m1%200h2m2%200h3m1%200h2M0%2011.5h5m4%200h1m1%200h1m1%200h4m1%200h1m3%200h1m1%200h4m1%200h1m1%200h2M1%2012.5h2m3%200h1m2%200h2m1%200h1m5%200h2m1%200h1m2%200h3m2%200h1m2%200h1M1%2013.5h1m3%200h1m3%200h1m3%200h1m2%200h1m1%200h1m4%200h2m1%200h2m3%200h1M3%2014.5h1m2%200h5m1%200h1m2%200h4m3%200h2m4%200h1M0%2015.5h1m3%200h1m3%200h1m1%200h4m2%200h6m1%200h4m1%200h3M0%2016.5h1m1%200h9m1%200h2m1%200h2m1%200h4m3%200h2m1%200h3M0%2017.5h2m1%200h3m2%200h3m1%200h1m2%200h1m1%200h1m1%200h8m1%200h2m1%200h1M0%2018.5h1m1%200h1m1%200h4m1%200h1m2%200h4m1%200h1m4%200h1m5%200h1m1%200h2M0%2019.5h2m5%200h2m1%200h2m2%200h1m5%200h2m1%200h2m2%200h2m3%200h1M0%2020.5h1m2%200h1m2%200h2m1%200h7m2%200h1m1%200h1m2%200h1m2%200h5m1%200h1M0%2021.5h4m4%200h2m3%200h1m1%200h1m1%200h2m6%200h1m2%200h1m1%200h1m1%200h1M3%2022.5h4m1%200h1m4%200h1m2%200h2m4%200h1m3%200h1m1%200h2m1%200h2M1%2023.5h3m6%200h1m1%200h1m1%200h1m1%200h2m1%200h1m1%200h2m1%200h1m2%200h1m1%200h4M0%2024.5h1m1%200h1m1%200h5m1%200h1m1%200h1m2%200h1m4%200h2m2%200h9M8%2025.5h1m1%200h1m1%200h1m2%200h3m2%200h1m2%200h2m3%200h2m1%200h2M0%2026.5h7m1%200h3m1%200h1m1%200h3m2%200h1m2%200h3m1%200h1m1%200h1m3%200h1M0%2027.5h1m5%200h1m1%200h1m1%200h3m1%200h2m3%200h1m1%200h4m3%200h1m1%200h1m1%200h1M0%2028.5h1m1%200h3m1%200h1m2%200h2m3%200h1m2%200h1m1%200h2m2%200h6m1%200h1m1%200h1M0%2029.5h1m1%200h3m1%200h1m1%200h2m2%200h1m4%200h5m2%200h2m3%200h3M0%2030.5h1m1%200h3m1%200h1m1%200h1m1%200h3m4%200h3m1%200h3m2%200h2M0%2031.5h1m5%200h1m3%200h1m1%200h5m2%200h1m1%200h4m3%200h1m1%200h1m1%200h1M0%2032.5h7m1%200h2m2%200h2m1%200h1m1%200h2m3%200h4m4%200h1%22%2F%3E%3C%2Fsvg%3E"
						alt="QR Code for SR-BOT"
						className="w-3/5 mx-auto mb-4"
					/>
					<p className="text-center">
						Scan the QR code above to connect to SR-BOT on WhatsApp.
					</p>
				</div>
			</div>
		</div>

	);
};
export default NotificationSignupPage;
