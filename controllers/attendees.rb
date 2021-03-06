class AttendeesController < Sinatra::Base 
	enable :method_override
	helpers Sinatra::ApiRequest

	before do
		content_type :json
	end

	helpers do
		def attendee_id 
			api_request[:params][:id]
		end

	end

	#ATTENDEE MODEL CRUD

	# Get all attendees records
	get '/' do
		Attendee.all().to_json
	end

	# Get specific attendee record
	get '/:id' do
		Attendee.get(attendee_id).to_json
	end

	#Create new attendee record for event by user
	post '/' do 
		user_id = api_request[:json_body]["user_id"]
		event_id = api_request[:json_body]["event_id"]
		user = User.get(user_id)
		event = Event.get(event_id)
		attendee = event.attendee.new
		attendee.user = user
		halt(api_error 1002) unless attendee.save
		attendee.to_json
	end

	#Delete attendee record
	delete '/:id' do 
		attendee ||= Attendee.get(attendee_id) || halt(api_error 1001)
		attendee.destroy()
	end

end
