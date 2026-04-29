// See https://aka.ms/new-console-template for more information
// See https://aka.ms/new-console-template for more information
using BCrypt.Net;

Console.WriteLine("Generating BCrypt hash for 'admin123':");
string hash = BCrypt.HashPassword("admin123");
Console.WriteLine($"Hash: {hash}");
Console.WriteLine("Verifying:");
bool isValid = BCrypt.Verify("admin123", hash);
Console.WriteLine($"Verification result: {isValid}");
