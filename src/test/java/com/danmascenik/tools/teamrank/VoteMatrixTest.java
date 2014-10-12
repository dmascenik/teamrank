package com.danmascenik.tools.teamrank;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.danmascenik.tools.teamrank.VoteMatrix.Builder;
import com.google.common.collect.Sets;

public class VoteMatrixTest {

  VoteMatrix<String> m;

  @Test
  public void testInitialMatrixValues() {
    assertEquals(0f, m.valueAt("a", "a"), 0.01f); // self-votes should be ignored
    assertEquals(0.33f, m.valueAt("a", "b"), 0.01f);
    assertEquals(0.33f, m.valueAt("a", "c"), 0.01f);
    assertEquals(0.33f, m.valueAt("a", "d"), 0.01f);
    assertEquals(0f, m.valueAt("a", "e"), 0.01f);

    assertEquals(0.33f, m.valueAt("b", "a"), 0.01f);
    assertEquals(0f, m.valueAt("b", "b"), 0.01f);
    assertEquals(0.33f, m.valueAt("b", "c"), 0.01f);
    assertEquals(0.33f, m.valueAt("b", "d"), 0.01f);
    assertEquals(0f, m.valueAt("b", "e"), 0.01f);

    assertEquals(0.25f, m.valueAt("c", "a"), 0.01f);
    assertEquals(0.25f, m.valueAt("c", "b"), 0.01f);
    assertEquals(0f, m.valueAt("c", "c"), 0.01f);
    assertEquals(0.25f, m.valueAt("c", "d"), 0.01f);
    assertEquals(0.25f, m.valueAt("c", "e"), 0.01f);

    assertEquals(0f, m.valueAt("d", "a"), 0.01f);
    assertEquals(1f, m.valueAt("d", "b"), 0.01f);
    assertEquals(0f, m.valueAt("d", "c"), 0.01f);
    assertEquals(0f, m.valueAt("d", "d"), 0.01f);
    assertEquals(0f, m.valueAt("d", "e"), 0.01f);

    assertEquals(0f, m.valueAt("e", "a"), 0.01f);
    assertEquals(0.5f, m.valueAt("e", "b"), 0.01f);
    assertEquals(0f, m.valueAt("e", "c"), 0.01f);
    assertEquals(0.5f, m.valueAt("e", "d"), 0.01f);
    assertEquals(0f, m.valueAt("e", "e"), 0.01f);
  }

  @Test
  public void testSetBreakoutProbability() {
    assertEquals(VoteMatrix.BREAKOUT_PROBABILITY, m.getBreakoutProbability(), 0f);
    assertFalse(VoteMatrix.BREAKOUT_PROBABILITY == 0.5f);
    m.setBreakoutProbability(0.5f);
    assertEquals(0.5f, m.getBreakoutProbability(), 0f);
  }

  @Test(expected = IllegalArgumentException.class)
  public void testSetZeroBreakoutProbability() {
    m.setBreakoutProbability(0f);
  }

  @Test(expected = IllegalArgumentException.class)
  public void testSetNegativeBreakoutProbability() {
    m.setBreakoutProbability(-0.1f);
  }

  @Test(expected = IllegalArgumentException.class)
  public void testSetBreakoutProbabilityGreaterThanOne() {
    m.setBreakoutProbability(1.0000001f);
  }

  @Test
  public void testSetVerySmallBreakoutProbability() {
    m.setBreakoutProbability(0.0000000001f);
  }

  @Test
  public void testGetDominantEigenvector() {
    float[] i = m.getDominantEigenvector();
    assertEquals(5, i.length); // everyone has a rank
    assertTrue(m.getIterationCount() > 0); // The power method actually happened
    assertTrue(m.getIterationCount() < VoteMatrix.MAX_ITERATIONS); // It converged on a final value
    for (int x = 0; x < i.length; x++) {
      assertTrue(i[x] > 0f); // All values are greater than zero
    }
    assertEquals(1f, i[i.length - 1], 0f); // Vector is normalized, so last value is 1.0

    int idxOfMax = -1;
    int idxOfMin = -1;
    float max = i[0];
    float min = i[0];
    for (int x = 0; x < i.length; x++) {
      if (i[x] > max) {
        idxOfMax = x;
        max = i[x];
      }
      if (i[x] < min) {
        idxOfMin = x;
        min = i[x];
      }
    }
    assertEquals("b", m.getVoterForIndex(idxOfMax)); // b should be winner
    assertEquals("e", m.getVoterForIndex(idxOfMin)); // e should be last
  }

  @Test
  public void testGetDominantEigenvectorHundredPercentBreakout() {
    m.setBreakoutProbability(1.0f); // turns the randomness up to 100%, votes have no effect at all
    float[] i = m.getDominantEigenvector();
    for (int x = 0; x < i.length; x++) {
      assertEquals(1f, i[x], 0f); // all values should be 1
    }
    assertEquals(1, m.getIterationCount()); // initial vector will be the final vector
  }

  @Before
  public void before() {
    Builder<String> b = new Builder<String>(Sets.newHashSet("a", "b", "c", "d", "e"));
    // no one votes for e
    // c votes for no one
    // everyone votes for b (except c)
    // a votes for everyone except e, including himself
    b.castVote("a", "a");
    b.castVote("a", "b");
    b.castVote("a", "c");
    b.castVote("a", "d");

    b.castVote("b", "a");
    b.castVote("b", "c");
    b.castVote("b", "d");

    b.castVote("d", "b");

    b.castVote("e", "b");
    b.castVote("e", "d");
    m = b.build();
  }

  @After
  public void after() {
    m = null;
  }
}
