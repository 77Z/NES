//Copyright (C) 77Z 2020
//Copyright (C) Vince Richter 2020

#include "main.h"

void print(std::string text) {
    std::cout << text << std::endl;
}

inline bool exists(const std::string& name) {
    struct stat buffer;
    return (stat (name.c_str(), &buffer) == 0);
}

int main() {
    print("Running Linux Tests");

    if (exists("./node_modules/electron/dist/electron")) {
        print("Test 1 Passed");
    } else {
        print("Test 1 Failed");
        exit(1);
    }

    if (exists("./node_modules/jsnes/dist/jsnes.min.js")) {
        print("Test 2 Passed");
    } else {
        print("Test 2 Failed");
        exit(1);
    }

    print("All tests passed (Linux)");

    return 0;
}