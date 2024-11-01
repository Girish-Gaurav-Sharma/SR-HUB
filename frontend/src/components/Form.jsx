import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
// import { db } from '../firebaseConfig';
// import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const NotificationSignupPage = ({ long, lat, calendarData }) => {
	const [activeTab, setActiveTab] = useState('realtime');

	const tabs = [
		{ name: 'Realtime Notification', value: 'realtime' },
		{ name: 'WhatsApp SR-bot', value: 'whatsapp' },
	];

	return (
		<div className="notification-signup-page min-h-screen bg-gray-100 p-4">
			<div className="max-w-3xl mx-auto">
				<div className="bg-white rounded-lg shadow-lg">
					{/* Tab Navigation */}
					<nav className="flex">
						{tabs.map(tab => (
							<button
								key={tab.value}
								onClick={() => setActiveTab(tab.value)}
								className={`flex-1 text-center py-4 px-6 font-medium ${
									activeTab === tab.value
										? 'border-b-2 border-blue-600 text-blue-600'
										: 'text-gray-600 hover:text-blue-600'
								}`}>
								{tab.name}
							</button>
						))}
					</nav>

					{/* Tab Content */}
					<div className="p-6 md:p-8">
						{activeTab === 'realtime' && (
							<RealtimeNotificationForm
								long={long}
								lat={lat}
							/>
						)}
						{activeTab === 'whatsapp' && <WhatsAppSRTutorial />}
					</div>
				</div>
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
		// Form submission logic here
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-6">
			<h2 className="text-2xl font-semibold text-gray-800 text-center">
				Sign Up for Notifications
			</h2>
			<p className="text-gray-600 text-center">
				Get notified before the satellite overpass at your location.
			</p>
			{errors.submit && (
				<p className="text-red-600 text-center">
					{errors.submit.message}
				</p>
			)}
			<div className="space-y-4">
				{/* Name Field */}
				<div>
					<label className="block mb-1 text-gray-700">Name</label>
					<input
						type="text"
						{...register('name', { required: 'Name is required' })}
						className={`border ${
							errors.name ? 'border-red-500' : 'border-gray-300'
						} rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
						placeholder="Your Name"
					/>
					{errors.name && (
						<p className="text-red-600 text-sm mt-1">
							{errors.name.message}
						</p>
					)}
				</div>
				{/* Email Field */}
				<div>
					<label className="block mb-1 text-gray-700">Email</label>
					<input
						type="email"
						{...register('email', {
							required: 'Email is required',
						})}
						className={`border ${
							errors.email ? 'border-red-500' : 'border-gray-300'
						} rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
						placeholder="you@example.com"
					/>
					{errors.email && (
						<p className="text-red-600 text-sm mt-1">
							{errors.email.message}
						</p>
					)}
				</div>
				{/* Mobile Field */}
				<div>
					<label className="block mb-1 text-gray-700">
						Mobile Number
						<span className="text-sm text-gray-500">
							{' '}
							(for SMS notifications)
						</span>
					</label>
					<PhoneInput
						international
						defaultCountry="IN"
						{...register('mobile', {
							required: 'Mobile number is required',
						})}
						className={`border ${
							errors.mobile ? 'border-red-500' : 'border-gray-300'
						} rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
					/>
					{errors.mobile && (
						<p className="text-red-600 text-sm mt-1">
							{errors.mobile.message}
						</p>
					)}
				</div>
				{/* Lead Time Fields */}
				<div>
					<label className="block mb-1 text-gray-700">
						Lead Time for Notification
					</label>
					<div className="flex space-x-4">
						<div className="w-1/2">
							<input
								type="number"
								min="0"
								max="2"
								{...register('leadTimeDays', {
									required: 'Days are required',
								})}
								className={`border ${
									errors.leadTimeDays
										? 'border-red-500'
										: 'border-gray-300'
								} rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
								placeholder="Days"
							/>
							{errors.leadTimeDays && (
								<p className="text-red-600 text-sm mt-1">
									{errors.leadTimeDays.message}
								</p>
							)}
						</div>
						<div className="w-1/2">
							<input
								type="number"
								min="0"
								max="24"
								{...register('leadTimeHours', {
									required: 'Hours are required',
								})}
								className={`border ${
									errors.leadTimeHours
										? 'border-red-500'
										: 'border-gray-300'
								} rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
								placeholder="Hours"
							/>
							{errors.leadTimeHours && (
								<p className="text-red-600 text-sm mt-1">
									{errors.leadTimeHours.message}
								</p>
							)}
						</div>
					</div>
					<p className="text-sm text-gray-500 mt-2">
						Set how much time in advance you want to be notified.
					</p>
				</div>
			</div>
			<button
				type="submit"
				className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-full shadow-md transition duration-300">
				Submit
			</button>
		</form>
	);
};

const WhatsAppSRTutorial = () => {
	return (
		<div className="space-y-8">
			<h2 className="text-2xl font-semibold text-gray-800 text-center">
				WhatsApp SR-BOT Tutorial
			</h2>
			<div className="space-y-4">
				<h3 className="text-xl font-medium text-gray-700">
					What is SR-BOT?
				</h3>
				<p className="text-gray-700 leading-relaxed">
					SR-BOT is an advanced conversational assistant available on
					WhatsApp. Beyond timely notifications of satellite
					overpasses, you can inquire about SR data for specific
					locations, upcoming satellite passes, and even receive SR
					data directly in your WhatsApp inbox. It's a powerful tool
					designed to provide you with quick and easy access to the
					information you need.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Method 1 */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium text-gray-700">
						Method 1: Join via Message
					</h3>
					<ol className="list-decimal list-inside space-y-2 text-gray-700">
						<li>
							Save the number{' '}
							<span className="font-medium text-blue-600">
								+1 415 523 8886
							</span>{' '}
							to your contacts.
						</li>
						<li>
							Send the message{' '}
							<span className="font-medium text-blue-600">
								join own-already
							</span>{' '}
							to the number on WhatsApp.
						</li>
						<li>
							You'll receive a confirmation message indicating a
							successful connection to SR-BOT.
						</li>
						<li>
							Follow the instructions provided to start using
							SR-BOT.
						</li>
					</ol>
				</div>
				{/* Method 2 */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium text-gray-700">
						Method 2: Scan QR Code
					</h3>
					<div className="flex justify-center">
						<img
							src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2033%2033%22%20shape-rendering%3D%22crispEdges%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M0%200h33v33H0z%22%2F%3E%3Cpath%20stroke%3D%22%23000000%22%20d%3D%22M0%200.5h7m1%200h2m2%200h6m1%200h1m3%200h2m1%200h7M0%201.5h1m5%200h1m1%200h1m2%200h3m1%200h1m2%200h1m1%200h1m2%200h2m1%200h1m5%200h1M0%202.5h1m1%200h3m1%200h1m2%200h1m2%200h1m4%200h1m1%200h1m1%200h4m1%200h1m1%200h3m1%200h1M0%203.5h1m1%200h3m1%200h1m1%200h2m2%200h1m1%200h3m2%200h2m1%200h3m1%200h1m1%200h3m1%200h1M0%204.5h1m1%200h3m1%200h1m2%200h1m3%200h2m2%200h1m2%200h5m1%200h1m1%200h3m1%200h1M0%205.5h1m5%200h1m4%200h2m1%200h1m4%200h5m2%200h1m5%200h1M0%206.5h7m1%200h1m1%200h1m1%200h1m1%200h1m1%200h1m1%200h1m1%200h1m1%200h1m1%200h1m1%200h7M8%207.5h3m1%200h3m2%200h1m2%200h1m1%200h1M0%208.5h1m1%200h2m1%200h3m2%200h1m2%200h2m2%200h3m2%200h1m3%200h1m2%200h1m1%200h2M1%209.5h1m1%200h3m1%200h3m1%200h1m2%200h3m3%200h7m2%200h2m1%200h1M0%2010.5h1m1%200h1m2%200h7m2%200h2m1%200h1m1%200h3m1%200h2m2%200h3m1%200h2M0%2011.5h5m4%200h1m1%200h1m1%200h4m1%200h1m3%200h1m1%200h4m1%200h1m1%200h2M1%2012.5h2m3%200h1m2%200h2m1%200h1m5%200h2m1%200h1m2%200h3m2%200h1m2%200h1M1%2013.5h1m3%200h1m3%200h1m3%200h1m2%200h1m1%200h1m4%200h2m1%200h2m3%200h1M3%2014.5h1m2%200h5m1%200h1m2%200h4m3%200h2m4%200h1M0%2015.5h1m3%200h1m3%200h1m1%200h4m2%200h6m1%200h4m1%200h3M0%2016.5h1m1%200h9m1%200h2m1%200h2m1%200h4m3%200h2m1%200h3M0%2017.5h2m1%200h3m2%200h3m1%200h1m2%200h1m1%200h1m1%200h8m1%200h2m1%200h1M0%2018.5h1m1%200h1m1%200h4m1%200h1m2%200h4m1%200h1m4%200h1m5%200h1m1%200h2M0%2019.5h2m5%200h2m1%200h2m2%200h1m5%200h2m1%200h2m2%200h2m3%200h1M0%2020.5h1m2%200h1m2%200h2m1%200h7m2%200h1m1%200h1m2%200h1m2%200h5m1%200h1M0%2021.5h4m4%200h2m3%200h1m1%200h1m1%200h2m6%200h1m2%200h1m1%200h1m1%200h1M3%2022.5h4m1%200h1m4%200h1m2%200h2m4%200h1m3%200h1m1%200h2m1%200h2M1%2023.5h3m6%200h1m1%200h1m1%200h1m1%200h2m1%200h1m1%200h2m1%200h1m2%200h1m1%200h4M0%2024.5h1m1%200h1m1%200h5m1%200h1m1%200h1m2%200h1m4%200h2m2%200h9M8%2025.5h1m1%200h1m1%200h1m2%200h3m2%200h1m2%200h2m3%200h2m1%200h2M0%2026.5h7m1%200h3m1%200h1m1%200h3m2%200h1m2%200h3m1%200h1m1%200h1m3%200h1M0%2027.5h1m5%200h1m1%200h1m1%200h3m1%200h2m3%200h1m1%200h4m3%200h1m1%200h1m1%200h1M0%2028.5h1m1%200h3m1%200h1m2%200h2m3%200h1m2%200h1m1%200h2m2%200h6m1%200h1m1%200h1M0%2029.5h1m1%200h3m1%200h1m1%200h2m2%200h1m4%200h5m2%200h2m3%200h3M0%2030.5h1m1%200h3m1%200h1m1%200h1m1%200h3m4%200h3m1%200h3m2%200h2M0%2031.5h1m5%200h1m3%200h1m1%200h5m2%200h1m1%200h4m3%200h1m1%200h1m1%200h1M0%2032.5h7m1%200h2m2%200h2m1%200h1m1%200h2m3%200h4m4%200h1%22%2F%3E%3C%2Fsvg%3E"
							alt="QR Code for SR-BOT"
							className="w-3/5 mx-auto"
						/>
					</div>
					<p className="text-gray-700 text-center">
						Scan the QR code above to connect with SR-BOT on
						WhatsApp.
					</p>
				</div>
			</div>
		</div>
	);
};

export default NotificationSignupPage;
