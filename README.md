async-kit ak-massive data stream wrapper for massivejs

Wrapper to take the SQL file interfaces of massive and wrap all
the calls with a version that returns a stream that can be passed
to other streams for processing, versus using the callback with
stream that massive provides by default.
