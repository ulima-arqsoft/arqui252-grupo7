//
//  ExploreView.swift
//  Loop
//
//  Created by Kohji Onaja on 23/08/25.
//

import SwiftUI

struct ExploreView: View {
    @ObservedObject var viewModel: ExploreViewModel
    var body: some View {
        Text("Explore")
    }
}

#Preview {
    ExploreViewBuilder.build()
}
