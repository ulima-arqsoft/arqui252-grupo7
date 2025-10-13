//
//  ViewExtensions.swift
//  NavigationRouting
//
//  Created by Kohji Onaja on 8/06/25.
//

import SwiftUI

extension View {
    func sheetBehavior(_ behavior: SheetPresentationModifier.SheetBehavior? = .default) -> some View {
        modifier(SheetPresentationModifier(behavior: behavior))
    }
}
