package com.danmascenik.tools.teamrank;

import org.junit.Test;

import com.danmascenik.tools.teamrank.TeamRank;

public class TeamRankTest {

  float[][] hSample = new float[][] { {1, 0, 0}, {0, 0, 0}, {1, 1, 0}};

  @Test
  public void testMakeStochastic() {
    float[][] s = TeamRank.makeStochastic(hSample);
    TeamRank.printMatrix(s);
  }

}
