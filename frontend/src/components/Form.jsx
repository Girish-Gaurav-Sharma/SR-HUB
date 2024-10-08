import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
// import { db } from '../firebaseConfig';
// import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const NotificationSignupPage = ({ long, lat }) => {
	const [activeTab, setActiveTab] = useState('realtime');

	const renderTabs = () => {
		return (
			<div className="tabs flex mb-4">
				<button
					className={`tab flex-1 py-2 px-4 text-center rounded-t-lg ${
						activeTab === 'realtime'
							? 'bg-white text-black shadow-md'
							: 'bg-gray-200 text-gray-600'
					}`}
					onClick={() => setActiveTab('realtime')}>
					Realtime Notification
				</button>
				<button
					className={`tab flex-1 py-2 px-4 text-center rounded-t-lg ${
						activeTab === 'whatsapp'
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
				Realtime Notification Signup
			</h2>
			{errors.submit && (
				<p className="text-red-500">{errors.submit.message}</p>
			)}
			<div className="mb-4">
				<label className="block mb-2 text-gray-700">Name</label>
				<input
					type="text"
					{...register('name', { required: 'Name is required' })}
					className={`border rounded px-3 py-2 w-full ${
						errors.name ? 'border-red-500' : ''
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
					className={`border rounded px-3 py-2 w-full ${
						errors.email ? 'border-red-500' : ''
					}`}
				/>
				{errors.email && (
					<p className="text-red-500">{errors.email.message}</p>
				)}
			</div>
			<div className="mb-4">
				<label className="block mb-2 text-gray-700">Mobile</label>
				<PhoneInput
					international
					defaultCountry="US"
					{...register('mobile', {
						required: 'Mobile number is required',
					})}
					className={`border rounded px-3 py-2 w-full ${
						errors.mobile ? 'border-red-500' : ''
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
						<input
							type="number"
							min="0"
							{...register('leadTimeDays', {
								required: 'Days are required',
							})}
							className={`border rounded px-3 py-2 w-full ${
								errors.leadTimeDays ? 'border-red-500' : ''
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
						<input
							type="number"
							min="0"
							{...register('leadTimeHours', {
								required: 'Hours are required',
							})}
							className={`border rounded px-3 py-2 w-full ${
								errors.leadTimeHours ? 'border-red-500' : ''
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
		<div className="whatsapp-sr-tutorial p-4 bg-white shadow-md rounded-lg">
			<h2 className="text-xl font-bold mb-4">WhatsApp SR-bot Tutorial</h2>
			<p className="mb-4">
				To join our WhatsApp SR-bot, please follow the steps below:
			</p>
			<ol className="list-decimal list-inside space-y-2">
				<li>
					Save the number <strong>+1 415 523 8886</strong> to your
					contacts.
				</li>
				<li>
					Send the message <strong>join &lt;your-code&gt;</strong> to
					the number on WhatsApp.
				</li>
				<li>
					You will receive a confirmation message. You are now
					connected to our SR-bot.
				</li>
				<li>
					If you have any questions, feel free to contact our support
					team.
				</li>
			</ol>
		</div>
	);
};

export default NotificationSignupPage;
