//
//  LoopButton.swift
//  Loop
//
//  Created by Kohji Onaja on 23/08/25.
//

import SwiftUI

/// A customizable button component for Fitia's UI design system.
///
/// `LoopButton` supports text, optional icons, customizable colors, borders, font styles,
/// and a loading state with an animated circular progress indicator.
///
/// Example usage:
/// ```swift
/// FitiaButton(text: "Confirm") {
///     print("Button tapped")
/// }
/// .backgroundColor(.yellow)
/// .foregroundColor(.black)
/// .fontSize(size: 16)
/// .fontWeight(weight: .semibold)
/// .setIsLoading(false)
/// .frameHeight(height: 54)
/// ```
///
/// You can also display an icon alongside the text:
/// ```swift
/// FitiaButton(text: "Add", iconType: .system("plus")) {
///     // Handle tap
/// }
/// ```
public struct LoopButton: View {
    
    // MARK: - Configuration Properties
    
    private var text: String
    private var iconType: IconType?
    private var alignment: Alignment?
    private var fontSize: CGFloat?
    private var fontWeight: Font.Weight?
    private var height: CGFloat = 54
    private var isLoading: Bool = false
    private var isEnabled: Bool = true
    
    private var lightForegroundColor: Color = .white
    private var darkForegroundColor: Color = .black
    private var lightBackgroundColor: Color = .black
    private var darkBackgroundColor: Color = .white
    
    private var dissableLightBackgroundColor: Color = .black.opacity(0.5)
    private var dissableDarkBackgroundColor: Color = .white.opacity(0.5)
    
    private var lightBorderColor: Color = .clear
    private var darkBorderColor: Color = .clear
    
    private var imageFrame: CGFloat = 24
    
    /// Action closure triggered when the button is tapped.
    private var onTapButton: () -> Void = {}
    
    @Environment(\.colorScheme) var colorScheme
    
    // MARK: - Initialization
    
    /// Creates a new `FitiaButton`.
    ///
    /// - Parameters:
    ///   - text: The button's label text. Defaults to `"Aceptar"`.
    ///   - iconType: An optional icon to display alongside the text.
    ///   - onTapButton: A closure executed when the button is tapped.
    public init(
        text: String = "Aceptar",
        iconType: IconType? = nil,
        onTapButton: @escaping () -> Void
    ) {
        self.text = text
        self.iconType = iconType
        self.onTapButton = onTapButton
    }
    
    // MARK: - Body
    
    public var body: some View {
        Button {
            onTapButton()
        } label: {
            ZStack(alignment: .center) {
                HStack(spacing: 6) {
                    if let iconType {
                        iconView(from: iconType)
                    }
                    Text(text)
                        .font(.system(size: fontSize ?? 16, weight: fontWeight ?? .semibold))
                        .foregroundStyle(getTextColor())
                }
                .foregroundColor(getTextColor())
                .opacity(isLoading ? 0 : 1)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: alignment ?? .center)
                
                if isLoading {
                    CircularProgressView(
                        percentage: .constant(0.25),
                        lineWidth: 4,
                        trackColor: .gray,
                        scoreColor: .white,
                        animationDuration: 1
                    )
                    .frame(width: imageFrame, height: imageFrame)
                    .startRotation()
                }
            }
            .padding(.horizontal)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .disabled(isLoading)
        .frame(height: height)
        .background {
            RoundedRectangle(cornerRadius: height/2)
                .stroke(colorScheme == .light ? lightBorderColor : darkBorderColor, lineWidth: 1.5)
                .background(getBackgroundColor())
        }
        .cornerRadius(height/2)
    }
    
    // MARK: - Icon Rendering
    
    @ViewBuilder
    private func iconView(from icon: IconType) -> some View {
        switch icon.kind {
        case .systemName(let name):
            Image(systemName: name)
                .resizable()
                .scaledToFit()
                .frame(width: imageFrame, height: imageFrame)
        case .resourceName(let name):
            Image(name)
                .renderingMode(.template)
                .resizable()
                .scaledToFit()
                .frame(width: imageFrame, height: imageFrame)
        case .view(let viewBuilder):
            viewBuilder
                .frame(height: imageFrame)
        }
    }
    
    // MARK: - View Modifiers
    
    /// Sets the text alignment inside the button.
    public func alignment(alignment: Alignment) -> LoopButton {
        var copy = self
        copy.alignment = alignment
        return copy
    }
    
    /// Sets the font size for the button's text.
    public func fontSize(size: CGFloat) -> LoopButton {
        var copy = self
        copy.fontSize = size
        return copy
    }
    
    /// Sets the font weight for the button's text.
    public func fontWeight(weight: Font.Weight) -> LoopButton {
        var copy = self
        copy.fontWeight = weight
        return copy
    }
    
    /// Sets different background colors for light and dark mode.
    public func backgroundColor(light: Color, dark: Color) -> LoopButton {
        var copy = self
        copy.lightBackgroundColor = light
        copy.darkBackgroundColor = dark
        return copy
    }
    
    /// Sets the same background color for both light and dark mode.
    public func backgroundColor(_ color: Color) -> LoopButton {
        return backgroundColor(light: color, dark: color)
    }
    
    /// Sets different border colors for light and dark mode.
    public func borderColor(light: Color, dark: Color) -> LoopButton {
        var copy = self
        copy.lightBorderColor = light
        copy.darkBorderColor = dark
        return copy
    }
    
    /// Sets the same border color for both light and dark mode.
    public func borderColor(_ color: Color) -> LoopButton {
        return borderColor(light: color, dark: color)
    }
    
    /// Sets different text (foreground) colors for light and dark mode.
    public func foregroundColor(light: Color, dark: Color) -> LoopButton {
        var copy = self
        copy.lightForegroundColor = light
        copy.darkForegroundColor = dark
        return copy
    }
    
    /// Sets the same text (foreground) color for both light and dark mode.
    public func foregroundColor(_ color: Color) -> LoopButton {
        return foregroundColor(light: color, dark: color)
    }
    
    /// Sets the loading state of the button.
    public func setIsLoading(_ isLoading: Bool) -> LoopButton {
        var copy = self
        copy.isLoading = isLoading
        return copy
    }
    
    /// Sets whether the button is enabled.
    public func setIsEnabled(_ isEnabled: Bool) -> LoopButton {
        var copy = self
        copy.isEnabled = isEnabled
        return copy
    }
    
    /// Sets the height of the button.
    public func frameHeight(height: CGFloat) -> LoopButton {
        var copy = self
        copy.height = height
        return copy
    }
    
    /// Sets the size of the icon frame.
    public func imageFrame(frame: CGFloat) -> LoopButton {
        var copy = self
        copy.imageFrame = frame
        return copy
    }
    
    // MARK: - Private Helpers
    
    private func getBackgroundColor() -> Color {
        if isEnabled {
            return colorScheme == .light ? lightBackgroundColor : darkBackgroundColor
        } else {
            return colorScheme == .light ? .gray.opacity(0.3) : .gray.opacity(0.7)
        }
    }
    
    private func getTextColor() -> Color {
        if isEnabled {
            return colorScheme == .light ? lightForegroundColor : darkForegroundColor
        } else {
            return colorScheme == .light ? .gray.opacity(0.2) : .gray.opacity(0.5)
        }
    }
    
    // MARK: - IconType Definition
    
    /// Represents an icon that can be displayed in a `FitiaButton`.
    public struct IconType {
        
        /// The type of icon source.
        enum Kind {
            /// A system SF Symbol.
            case systemName(String)
            /// An image from the asset catalog.
            case resourceName(String)
            /// A custom SwiftUI view.
            case view(AnyView)
        }
        
        let kind: Kind
        
        private init(kind: Kind) {
            self.kind = kind
        }
        
        /// Creates a system symbol icon.
        static public func system(_ name: String) -> IconType {
            IconType(kind: .systemName(name))
        }
        
        /// Creates an icon from an image resource in the asset catalog.
        static public func resource(_ name: String) -> IconType {
            IconType(kind: .resourceName(name))
        }
        
        /// Creates an icon from a custom SwiftUI view.
        static public func customView<Content: View>(_ view: Content) -> IconType {
            IconType(kind: .view(AnyView(view)))
        }
    }
}

