@echo off
"%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319\csc.exe" NesTests.cs
move .\NesTests.exe ..\..\