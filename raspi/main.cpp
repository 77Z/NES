#include "include/raylib.h"

int main() {

    int windowWidth = 800;
    int windowHeight = 450;

    InitWindow(windowWidth, windowHeight, "Window");

    SetTargetFPS(60);

    while(!WindowShouldClose()) {
        BeginDrawing();

            ClearBackground(RAYWHITE);
            DrawText("Lol", 10, 10, 20, BLACK);

        EndDrawing();
    }

    CloseWindow();

    return 0;
}