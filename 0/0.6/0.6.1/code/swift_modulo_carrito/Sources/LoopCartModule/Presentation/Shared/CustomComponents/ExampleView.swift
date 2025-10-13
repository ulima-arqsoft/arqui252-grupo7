//
//  ExampleView.swift
//  Loop
//
//  Created by Kohji Onaja on 23/08/25.
//

import SwiftUI

/// A customizable circular progress indicator that visually represents a percentage value.
///
/// `CircularProgressView` draws a background track and a foreground progress arc,
/// with optional animation when the percentage changes.
///
/// You can customize the line width, colors, and animation duration.
///
/// Example usage:
/// ```swift
/// struct ExampleView: View {
///     @State private var progress: CGFloat = 0.75
///
///     var body: some View {
///         CircularProgressView(
///             percentage: $progress,
///             lineWidth: 4,
///             trackColor: .init(light: .gray.opacity(0.2), dark: .gray.opacity(0.5)),
///             scoreColor: .blue,
///             animationDuration: 1.0
///         )
///         .frame(width: 100, height: 100)
///     }
/// }
/// ```
public struct CircularProgressView: View {
    
    // MARK: - Properties
    
    /// The binding to the current progress value, expressed as a fraction between `0` and `1`.
    @Binding var percentage: CGFloat
    
    /// The width of the circular stroke.
    var lineWidth: CGFloat
    
    /// The color pair (light/dark) used for the track (background circle).
    var trackColor: Color
    
    /// The color of the progress arc.
    var scoreColor: Color
    
    /// The duration of the progress animation, in seconds.
    var animationDuration: Double

    /// The currently animated progress value.
    @State private var animatedPercentage: CGFloat = 0
    
    // MARK: - Initialization
    
    /// Creates a new circular progress view.
    ///
    /// - Parameters:
    ///   - percentage: A binding to the current progress value (0.0 to 1.0).
    ///   - lineWidth: The width of the circular stroke. Default is `3`.
    ///   - trackColor: The color of the track (background circle). Defaults to a light/dark gray pair.
    ///   - scoreColor: The color of the progress arc. Default is Fitia's yellow.
    ///   - animationDuration: The duration of the progress animation. Default is `1` second.
    public init(
        percentage: Binding<CGFloat>,
        lineWidth: CGFloat = 3,
        trackColor: Color = .black,
        scoreColor: Color = .black,
        animationDuration: Double = 1
    ) {
        self._percentage = percentage
        self.lineWidth = lineWidth
        self.trackColor = trackColor
        self.scoreColor = scoreColor
        self.animationDuration = animationDuration
    }
    
    // MARK: - View Body
    
    public var body: some View {
        ZStack {
            // Track (background circle)
            Circle()
                .stroke(trackColor,lineWidth: lineWidth)
            
            // Progress arc
            Circle()
                .trim(from: 0, to: animatedPercentage)
                .stroke(scoreColor,
                        style: StrokeStyle(lineWidth: lineWidth, lineCap: .round))
                .rotationEffect(.degrees(-90)) // Start from top
                .animation(.linear(duration: animationDuration), value: animatedPercentage)
        }
        .onAppear {
            animatedPercentage = percentage
        }
        .onChange(of: percentage) { _ , newValue in
            withAnimation(.linear(duration: animationDuration)) {
                animatedPercentage = newValue
            }
        }
    }
}

