//
//  ContentView.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

struct MainView: View {
    
    @ObservedObject var viewModel: MainViewModel
    @ObservedObject var authMonitor: AuthMonitor
    
    var body: some View {
        switch authMonitor.authState {
            case .loggedIn:
            NavigatableView { router in
                MainTabViewBuilder.build()
            }
            case .loggedOut:
            NavigatableView { router in
                Something(router: router)
            }
        }
    }
    
    @ViewBuilder
    func Something(router: Router?) -> some View {
        VStack {
            Spacer()
            LoopButton(text: "Login",onTapButton: viewModel.onLoginButtonTapped)
            LoopButton(text: "Sign up",onTapButton: viewModel.onSignInButtonTapped)
        }
        .padding()
    }
}

#Preview {
    MainViewBuilder.build()
}
