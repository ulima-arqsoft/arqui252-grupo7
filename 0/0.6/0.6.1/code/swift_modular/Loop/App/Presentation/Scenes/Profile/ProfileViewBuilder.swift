//
//  ProfileViewBuilder.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

@MainActor
struct ProfileViewBuilder {

    static func build() -> some View {
        ProfileViewContainer()
    }
    
    private static func innerBuilder() -> ProfileView {
        let viewModel = buildViewModel()
        return ProfileView(viewModel: viewModel)
    }
    
    private static func buildViewModel() -> ProfileViewModel {
        ProfileViewModel()
    }

    private struct ProfileViewContainer: View {
        
        var body: some View {
            innerBuilder()
        }
    }
}
