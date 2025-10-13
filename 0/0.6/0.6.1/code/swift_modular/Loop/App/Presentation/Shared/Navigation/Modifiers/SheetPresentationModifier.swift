//
//  SheetPresentationModifier.swift
//  Fitia
//
//  Created by Kohji Onaja on 1/07/25.
//  Copyright © 2025 Ulises Olave mendoza. All rights reserved.
//


import SwiftUI

struct SheetPresentationModifier: ViewModifier {
    
    @State private var height: CGFloat = 200
    let behavior: SheetBehavior?

    func body(content: Content) -> some View {
        switch behavior {
        case .default:
            content
        case .custom(let config):
            content
                .presentationDetents(config.presentationDetents)
                .presentationDragIndicator(config.presentationDragIndicator)
        case .automatic:
            ReturnableSizeView { size in
                content
                    .presentationDetents([.height(size.height)])
            }
        case nil:
            content
        }
    }
    
    enum SheetBehavior {
        case `default`
        case custom(SheetConfig)
        case automatic
    }

    
    struct SheetConfig {
        var presentationDetents: Set<PresentationDetent>
        var presentationDragIndicator: Visibility
        
        init(
            presentationDetents: Set<PresentationDetent>,
            presentationDragIndicator: Visibility = .automatic
        ) {
            self.presentationDetents = presentationDetents
            self.presentationDragIndicator = presentationDragIndicator
        }
    }
}
