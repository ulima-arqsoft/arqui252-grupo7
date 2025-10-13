//
//  RouterViewModel.swift
//  NavigationRouting
//
//  Created by Kohji Onaja on 8/06/25.
//

import SwiftUI

class RouterViewModel: ObservableObject, Router {
    
    @Published var path: [NavigationDestination] = []
    @Published var sheet: NavigationDestination?
    @Published var fullScreen: NavigationDestination?
    @Published var oldPathCount: Int = 0
    @Published var sheetBehavior: SheetPresentationModifier.SheetBehavior?
    
    func showScreen(
        _ option: NavigationOption,
        @ViewBuilder builder: @escaping (Router?) -> some View
    ) {
        let destination = NavigationDestination(
            option: option,
            onDismiss: nil,
            destination: builder
        )
        switch option {
        case .push:
            path.append(destination)
            oldPathCount += 1
        case .sheet:
            sheet = destination
        case .fullScreenCover:
            fullScreen = destination
        }
    }
    
    func showScreens(_ views: NavigationDestination...) {
        for s in views {
            path.append(s)
        }
    }

    func showCustomSheet(
        _ behavior: SheetPresentationModifier.SheetBehavior?,
        onDismiss: (() -> Void)?,
        @ViewBuilder builder: @escaping (Router?) -> some View
    ) {
        let destination = NavigationDestination(
            option: .sheet,
            onDismiss: onDismiss,
            destination: builder
        )
        self.sheetBehavior = behavior
        sheet = destination
    }
    
    
    func popToRoot() {
        path.removeAll()
        oldPathCount = 0
    }
    
    func dismissSheet() {
        sheet = nil
    }
    
    func view(for destination: NavigationDestination) -> AnyView {
        return destination.build(self)
    }
    
}

