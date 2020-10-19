using System;
using System.IO;

class NesTests {
    static void Main() {
        Console.WriteLine("Running Windows Style Tests");

        if (File.Exists(@".\node_modules\electron\dist\electron.exe")) {
            Console.WriteLine("Test 1 Passed");
        } else {
            Console.WriteLine("Test 1 Failed");
            Environment.Exit(1);
        }

        if (File.Exists(@".\node_modules\jsnes\dist\jsnes.min.js")) {
            Console.WriteLine("Test 2 Passed");
        } else {
            Console.WriteLine("Test 2 Failed");
            Environment.Exit(1);
        }

        Console.WriteLine("All tests passed (Windows)");

        Environment.Exit(0);
    }
}