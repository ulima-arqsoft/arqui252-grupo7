// swift-tools-version: 6.2
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "LoopCartModule",
    platforms: [
        .iOS(.v17),
    ],
    products: [
        // Products define the executables and libraries a package produces, making them visible to other packages.
        .library(
            name: "LoopCartModule",
            targets: ["LoopCartModule"]
        ),
    ],
    dependencies: [
        .package(
            url: "https://github.com/Konaja04/LoopCore.git",
            from: "0.0.6"
        ),
    ],
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .target(
            name: "LoopCartModule",
            dependencies: [
                .product(name: "LoopCore", package: "LoopCore" ),
            ]
        ),

    ]
)
