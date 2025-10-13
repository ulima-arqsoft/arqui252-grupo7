//
//  MainTabViewBuilder.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

@MainActor
struct MainTabViewBuilder {

    static func build() -> some View {
        MainTabViewContainer()
    }
    
    private static func innerBuilder() -> MainTabView {
        MainTabView()
    }
    
    private static func buildViewModel() -> MainTabViewModel {
        MainTabViewModel()
    }

    private struct MainTabViewContainer: View {
        
        var body: some View {
            innerBuilder()
        }
    }
}
