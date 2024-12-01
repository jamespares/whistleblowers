# Secure Whistleblower Platform

A secure and encrypted platform for government whistleblowers to anonymously report corruption and incompetence.

## Security Features

- End-to-end encryption of all reports
- No session persistence
- Anonymous reporting system
- Secure headers implementation
- No tracking or logging of user information

## Prerequisites

- Node.js 18+ 
- npm
- Supabase account

## Setup

1. Clone the repository

```bash
git clone [repository-url]
cd whistleblowers
```

2. Install dependencies

```bash
npm install
```

3. Create a Supabase project and set up the database
- Create a new project at https://supabase.com
- Create a new table called 'reports' with the following schema:
  ```sql
  create table reports (
    id text primary key,
    encrypted_content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );
  ```

4. Configure environment variables
- Copy `.env.local` to your project root
- Update the following variables:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your-project-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
  ENCRYPTION_KEY=your-32-byte-encryption-key
  ```

5. Run the development server

```bash
npm run dev
```

## Security Considerations

- Always use HTTPS in production
- Regularly rotate encryption keys
- Monitor for suspicious activities
- Keep all dependencies updated
- Use secure headers and CSP
- Implement rate limiting in production

## Production Deployment

1. Set up proper SSL/TLS certificates
2. Configure secure headers
3. Set up rate limiting
4. Enable database encryption
5. Configure proper backup systems
6. Set up monitoring and alerting

## License

MIT

## Security Reporting

If you discover any security-related issues, please email [security contact] instead of using the public issue tracker.
