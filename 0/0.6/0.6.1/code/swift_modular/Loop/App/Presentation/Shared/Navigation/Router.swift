//
//  Router.swift
//  NavigationRouting
//
//  Created by Kohji Onaja on 8/06/25.
//

import SwiftUI


protocol Router: AnyObject {
    
    func showScreen<Content: View>(
        _ option: NavigationOption,
        @ViewBuilder builder: @escaping (Router?) -> Content
    )
    
    func showScreens(
        _ views: NavigationDestination...
    )
    
    func showCustomSheet(
        _ behavior: SheetPresentationModifier.SheetBehavior?,
        onDismiss: (() -> Void)?,
        @ViewBuilder builder: @escaping (Router?) -> some View
    )
    
    func popToRoot()
    
    func dismissSheet()
    
}
