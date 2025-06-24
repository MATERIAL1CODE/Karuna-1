# Karuna - Community Aid Platform

A comprehensive community aid platform built with Expo, React Native, and Supabase that connects people in need with those who can help through a network of volunteer facilitators.

## 🌟 Features

### For Citizens
- **Report Needs**: Submit reports about people in need with location, description, and optional video context
- **Log Donations**: Offer surplus resources for pickup and distribution
- **Track Impact**: Receive personalized AI-generated thank you letters showing the real impact of contributions
- **Activity History**: View all reports and donations with their current status

### For Facilitators
- **Mission Dashboard**: View available missions sorted by proximity
- **Real-time Tracking**: Update mission status through the delivery lifecycle
- **Geospatial Matching**: Automatic matching of nearby needs and donations
- **Impact Stories**: Write personalized thank you letters for donors and reporters

### Backend Features
- **Intelligent Matching**: PostGIS-powered geospatial matching engine
- **Secure Video Storage**: Private video uploads with role-based access
- **AI Storytelling**: Automated generation of personalized thank you letters
- **Real-time Updates**: Live mission tracking and status updates
- **Push Notifications**: Automated notifications for mission updates and impact stories

## 🏗️ Architecture

### Frontend
- **Expo Router**: File-based routing with tab navigation
- **React Native Paper**: Material Design 3 components
- **Supabase Client**: Real-time database and authentication
- **TypeScript**: Full type safety throughout the application

### Backend
- **Supabase Database**: PostgreSQL with PostGIS for geospatial operations
- **Edge Functions**: Serverless functions for business logic
- **Row Level Security**: Comprehensive security policies
- **Storage**: Secure file storage for videos and images

### Database Schema
- **profiles**: User information and roles
- **reports**: Need reports with location and context
- **donations**: Resource donations with pickup details
- **missions**: Coordinated delivery missions linking reports and donations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd karuna
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Add your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PICAOS_SECRET_KEY=your_picaos_api_key
```

4. Run database migrations:
```bash
# Apply all migrations in order
supabase db push
```

5. Deploy Edge Functions:
```bash
supabase functions deploy submit-report
supabase functions deploy log-donation
supabase functions deploy match-engine
supabase functions deploy facilitator-api
supabase functions deploy generate-thank-you-letter
```

6. Start the development server:
```bash
npm run dev
```

## 📱 Usage

### Setting Up the Database

1. **Create Tables**: Run the migration files in order:
   - `create_reports_table.sql`
   - `create_donations_table.sql`
   - `create_missions_table.sql`
   - `update_profiles_table.sql`

2. **Set Up Storage**: Run `create_storage_policies.sql` to configure secure video storage

3. **Add Database Functions**: Execute `shared/database-functions.sql` for geospatial utilities

### Authentication Flow

1. Users sign up with email/password and select their role (citizen or facilitator)
2. Profile is automatically created with role-based permissions
3. Role validation ensures users can only access appropriate features

### Citizen Workflow

1. **Report a Need**:
   - Select location on map
   - Add description and people count
   - Optionally record video context
   - Submit report for matching

2. **Log a Donation**:
   - Specify resource type and quantity
   - Set pickup location and contact details
   - Add pickup time preferences
   - Submit for automatic matching

3. **Track Impact**:
   - View activity history
   - Receive notifications when missions are completed
   - Read personalized thank you letters

### Facilitator Workflow

1. **View Available Missions**:
   - Browse missions sorted by proximity
   - See pickup and delivery details
   - View video context if available

2. **Accept and Execute Mission**:
   - Accept mission assignment
   - Update status through lifecycle:
     - `assigned` → `en_route_pickup` → `pickup_completed` → `en_route_delivery` → `completed`

3. **Complete Mission**:
   - Automatic thank you letter generation
   - Push notifications to citizens
   - Mission marked as completed

## 🔧 API Reference

### Edge Functions

#### Submit Report
```typescript
POST /functions/v1/submit-report
Content-Type: multipart/form-data

{
  location: { latitude: number, longitude: number },
  description?: string,
  people_in_need: number,
  video_file?: File
}
```

#### Log Donation
```typescript
POST /functions/v1/log-donation
Content-Type: application/json

{
  resource_type: string,
  quantity: string,
  pickup_location: { latitude: number, longitude: number },
  pickup_address: string,
  pickup_contact: string,
  pickup_time_preference: string,
  notes?: string
}
```

#### Facilitator API
```typescript
POST /functions/v1/facilitator-api
Content-Type: application/json

{
  action: 'getAvailableMissions' | 'acceptMission' | 'updateMissionStatus' | 'getMissionDetails',
  // Additional parameters based on action
}
```

## 🔒 Security

### Row Level Security (RLS)
- Users can only access their own reports and donations
- Facilitators can only view assigned missions
- Video access restricted to uploaders and assigned facilitators

### Data Privacy
- All video uploads are private by default
- Geolocation data is stored securely with PostGIS
- Personal information is protected with comprehensive RLS policies

## 🤖 AI Integration

### Thank You Letter Generation
- Triggered automatically when missions are completed
- Uses Picaos API for natural language generation
- Includes specific mission details and impact metrics
- Fallback system for API failures

### Prompt Engineering
- Contextual prompts with mission-specific details
- Personalized content based on donor/reporter information
- Authentic, human-like tone and style

## 📊 Analytics & Monitoring

### Built-in Analytics
- User action tracking
- Mission completion metrics
- Impact measurement
- Error monitoring

### Performance Monitoring
- Edge function execution times
- Database query performance
- Real-time status updates

## 🚀 Deployment

### Supabase Setup
1. Create new Supabase project
2. Configure authentication settings
3. Set up storage buckets
4. Deploy Edge Functions
5. Configure webhooks for AI letter generation

### Environment Configuration
- Production environment variables
- API key management
- CORS configuration
- Domain setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Supabase for the backend infrastructure
- Expo team for the development platform
- React Native Paper for UI components
- PostGIS for geospatial capabilities
- Picaos for AI text generation

---

Built with ❤️ for community impact