//
//  ViewExtensions.swift
//  Loop
//
//  Created by Kohji Onaja on 23/08/25.
//

import SwiftUI

extension View {
    
    /// Applies a continuous rotation animation to the view.
    ///
    /// Useful for indicating loading states with spinners or rotating icons.
    ///
    /// - Parameter timePerLap: Duration in seconds for one full rotation. Default is `0.75`.
    /// - Returns: A view with infinite rotation.
    ///
    /// Example:
    /// ```swift
    /// Image(systemName: "arrow.2.circlepath")
    ///     .startRotation(timePerLap: 1.0)
    /// ```
    func startRotation(timePerLap: TimeInterval = 0.75) -> some View {
        self.modifier(InfiniteRotationViewModifier(timePerLap: timePerLap))
    }
    
}
