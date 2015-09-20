package com.danmascenik.tools.teamrank;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.List;

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
  public void testGetSortedResults() {
    List<Rank<String>> results = m.getResults();
    assertNotNull(results);
    assertEquals(5, results.size());
    assertEquals("b", results.get(0).getId()); // b should be winner
    assertEquals("e", results.get(4).getId()); // e should be last
  }

  @Test
  public void testGetSortedResultsAsPercentages() {
    List<Rank<String>> results = m.getResults(true);
    assertNotNull(results);
    assertEquals(5, results.size());
    assertEquals("b", results.get(0).getId()); // b should be winner
    assertEquals("e", results.get(4).getId()); // e should be last
    float total = 0f;
    for (Rank<String> rank : results) {
      total += rank.getScore();
    }
    assertEquals(1.0f, total, 0.000001f);
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

  @Test
  public void testConverged() {
    float[] a = new float[] {1.0f, 1.1f, 1.2f, 1.3f};
    float[] b = new float[] {1.01f, 1.11f, 1.21f, 1.31f};
    assertFalse(VoteMatrix.converged(a, b));
    b = new float[] {1.0f, 1.1f, 1.2f, (1.3f + VoteMatrix.CONVERGENCE_MAX_DELTA)};
    assertFalse(VoteMatrix.converged(a, b)); // off by the max delta
    b = new float[] {1.0f, 1.1f, 1.2f, (1.3f + VoteMatrix.CONVERGENCE_MAX_DELTA / 2f)};
    assertTrue(VoteMatrix.converged(a, b)); // off by half the max delta
  }

  @Test(expected = IllegalArgumentException.class)
  public void testConvergedDifferentLengthVectors() {
    float[] a = new float[] {1.0f, 1.1f, 1.2f, 1.3f};
    float[] b = new float[] {1.01f, 1.11f, 1.21f};
    VoteMatrix.converged(a, b);
  }

  @Test
  public void testConvergedNullInput() {
    float[] a = new float[] {1.0f, 1.1f, 1.2f, 1.3f};
    float[] b = new float[] {1.01f, 1.11f, 1.21f, 1.31f};
    try {
      VoteMatrix.converged(a, null);
      fail("Should have thrown an NPE");
    } catch (NullPointerException e) {}
    try {
      VoteMatrix.converged(null, b);
      fail("Should have thrown an NPE");
    } catch (NullPointerException e) {}
  }

  @Test(expected = IllegalArgumentException.class)
  public void testMultiplyMismatchedSize() {
    float[][] m = new float[][] { {1f, 2f}, {2f, 1f}};
    float[] v = new float[] {1f, 2f, 3f};
    VoteMatrix.multiply(m, v);
  }

  @Test
  public void testMultipleNullInput() {
    float[][] m = new float[][] { {1f, 2f}, {2f, 1f}};
    float[] v = new float[] {1f, 2f, 3f};
    try {
      VoteMatrix.multiply(m, null);
      fail("Should have thrown an NPE");
    } catch (NullPointerException e) {}
    try {
      VoteMatrix.multiply(null, v);
      fail("Should have thrown an NPE");
    } catch (NullPointerException e) {}
  }

  @Test
  public void testNormalize() {
    float[] in = new float[] {4f, 6f, 2f};
    float[] out = VoteMatrix.normalize(in);
    assertEquals(2f, out[0], 0f);
    assertEquals(3f, out[1], 0f);
    assertEquals(1f, out[2], 0f);
  }

  @Test(expected = IllegalArgumentException.class)
  public void testNormalizeEmptyVector() {
    float[] in = new float[] {};
    VoteMatrix.normalize(in);
  }

  @Test(expected = IllegalArgumentException.class)
  public void testNormalizeZeroVector() {
    float[] in = new float[] {1f, 0f};
    VoteMatrix.normalize(in);
  }

  @Test(expected = NullPointerException.class)
  public void testNormalizeNullVector() {
    VoteMatrix.normalize(null);
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
