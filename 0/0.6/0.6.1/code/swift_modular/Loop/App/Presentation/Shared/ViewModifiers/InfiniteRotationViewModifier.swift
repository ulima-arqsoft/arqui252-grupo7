//
//  InfiniteRotationViewModifier.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

// MARK: - InfiniteRotationViewModifier

/// A view modifier that applies an infinite clockwise rotation to any SwiftUI view.
///
/// Useful for loading indicators, spinners, or animated UI elements.
///
/// Example:
/// ```swift
/// Image(systemName: "arrow.2.circlepath")
///     .modifier(InfiniteRotationModifier(timePerLap: 1.0))
/// ```
///
/// Or using the `View` extension:
/// ```swift
/// Image(systemName: "arrow.2.circlepath")
///     .startRotation()
/// ```
public struct InfiniteRotationViewModifier: ViewModifier {
    
    /// The duration of one full rotation (in seconds).
    public let timePerLap: TimeInterval
    
    @State private var rotate = false
    
    /// Creates a modifier that applies an infinite clockwise rotation.
    ///
    /// - Parameter timePerLap: The time in seconds for one full rotation. Default is `0.75`.
    public init(timePerLap: TimeInterval = 0.75) {
        self.timePerLap = timePerLap
    }
    
    public func body(content: Content) -> some View {
        content
            .rotationEffect(.degrees(rotate ? 360 : 0))
            .onAppear {
                withAnimation(Animation.linear(duration: timePerLap).repeatForever(autoreverses: false)) {
                    rotate = true
                }
            }
    }
}
